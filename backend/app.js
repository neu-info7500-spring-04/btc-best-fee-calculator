import express from 'express';
import fetch from 'node-fetch';
import cors from "cors";
const app = express();
const port = 8080;

app.use(cors());

app.use(express.json());

function getDatesFromTodayToSevenDaysAgo() {
    let dates = [];
    let today = new Date();
    for (let i = 6; i >= 0; i--) {
      let date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}
  
let dateRange = getDatesFromTodayToSevenDaysAgo();
console.log(dateRange);

let currentDate = new Date();
let year = currentDate.getUTCFullYear();
let month = currentDate.getUTCMonth() + 1;
let day = currentDate.getUTCDate();

month = month < 10 ? '0' + month : month;
day = day < 10 ? '0' + day : day;

let formattedDate = year + '-' + month + '-' + day;
  

console.log(formattedDate)

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
      'X-API-KEY': 'BQY56A4nyIVdODgl925qSr5pPFAj98TE',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();

  const transactions = responseData.data.bitcoin.transactions;

//   console.log(transactions)

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
                date: {since: "${dateRange[0]}"}) {
                date: date {
                  date(format: "%Y-%m-%d")
                }
                feeValue: feeValue(calculate: sum)
                inputCount: inputCount(calculate: sum)
                avgFee: feeValue(calculate: average)
              }
              inputs(options: {asc: "date.date"}, 
                date: {since: "${dateRange[0]}"}) {
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
          'X-API-KEY': 'BQY56A4nyIVdODgl925qSr5pPFAj98TE',
        },
        body: JSON.stringify(query),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

    //   const transactions = responseData.data.bitcoin.transactions;

    //   const inputs = responseData.data.bitcoin.inputs;

      return responseData.data.bitcoin;

    //   return { total_fee_value:  transactions[0].feeValue, avg_fee_value: transactions[0].avgFee, total_input_count: transactions[0].inputCount, total_input_value: inputs[0].value};
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