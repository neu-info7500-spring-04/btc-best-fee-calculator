import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const DataDisplayCard = ({ title, data }) => {
    return (
      <Card variant="outlined" sx={{ margin: 2 }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="h2">
            {data}
          </Typography>
        </CardContent>
      </Card>
    );
};

const TransactionStats = () => {
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <DataDisplayCard title="Best Fee" data="12.01 sat/vByte" />
        <DataDisplayCard title="Optimal Fee" data="12.01 / 23.15" />
        <DataDisplayCard title="Size" data="345.68 Mb" />
        <DataDisplayCard title="Virtual Size" data="207.69 vMb" />
        <DataDisplayCard title="Fee Amount" data="10.03212539 BTC" />
        <DataDisplayCard title="Inputs Count" data="3,143,862" />
        <DataDisplayCard title="Inputs Amount" data="8,331.36355506 BTC" />
      </Box>
    );
};
  
export default TransactionStats;