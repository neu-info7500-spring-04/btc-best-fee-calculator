import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = 8080;

app.use(express.json());

let currentDate = new Date();
let year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;
let day = currentDate.getDate();

month = month < 10 ? '0' + month : month;
day = day < 10 ? '0' + day : day;

let formattedDate = year + '-' + month + '-' + day;

const BITQUERY_URL = 'https://graphql.bitquery.io';

const num_of_transactions = 10

async function fetchBitcoinTransactions() {
  const query = {
    query: `
    {
      bitcoin {
        transactions(
          date: {is: "${formattedDate}"}
          options: {desc: "block.timestamp.iso8601", limit: ${num_of_transactions}}
        ) {
          block {
            height
            timestamp {
              iso8601
            }
          }
          hash
          feeValue
          feeValueDecimal
          inputCount
          inputCountBigInt
          inputValueDecimal
          txSize
          txVsize
          count
        }
      }
    }`,
  };

  const response = await fetch(BITQUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Provide your API key for Bitquery here
      'X-API-KEY': 'BQY56A4nyIVdODgl925qSr5pPFAj98TE',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();

  const transactions = responseData.data.bitcoin.transactions;

  console.log(transactions)

  let totalSize = 0;

  let totalVSize = 0;

  let values = []

  for(let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    let feePerVByte = (transaction.feeValue * 100000000) / transaction.txVsize;
    totalSize += transaction.txSize;
    totalVSize += transaction.txVsize;
    values.push(feePerVByte)
  }

  let sum = 0;
  for (var i = 0; i < values.length; i++) {
    sum += values[i];
  }

  return { best_fee: Math.min(...values), avg_fee: sum/10, avg_size: totalSize/10, avg_v_size: totalVSize/10 };
}

async function fetchBitcoinInputs() {
    const query = {
        query: `
        {
            bitcoin(network: bitcoin) {
              transactions(options: {asc: "date.date"}, 
                date: {is: "${formattedDate}"}) {
                date: date {
                  date(format: "%Y-%m-%d")
                }
                feeValue: feeValue(calculate: sum)
                inputCount: inputCount(calculate: sum)
                avgFee: feeValue(calculate: average)
              }
              inputs(options: {asc: "date.date"}, 
                date: {is: "${formattedDate}"}) {
                date: date {
                  date(format: "%Y-%m-%d")
                }
                count
                value: value(calculate: sum)
              }
            }
        }`,
    };

    const response = await fetch(BITQUERY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Provide your API key for Bitquery here
          'X-API-KEY': 'BQY56A4nyIVdODgl925qSr5pPFAj98TE',
        },
        body: JSON.stringify(query),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
}


// API endpoint
app.get('/bitcoin/transactions', async (req, res) => {
  try {
    const data = await fetchBitcoinTransactions();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Bitcoin transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/bitcoin/inputs', async (req, res) => {
    try {
        const data = await fetchBitcoinInputs();
        res.json(data);
    } catch (error) {
        console.error('Error fetching Bitcoin transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});