import './App.css';

import {
  Box,
  Container
} from '@material-ui/core';
import React, { useState } from 'react';

import BookTable from './components/book-table';
import CssBaseline from '@material-ui/core/CssBaseline';
import ImageCapture from './components/image-capture';
import Typography from '@material-ui/core/Typography';

function App() {
  const [tableData, setTableData] = useState([]);

  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography component="div">
          <Box style={{ height: "100%" }} display="flex" justifyContent="flex-start" flexDirection="column" color="text.primary">
            <Box
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                margin: "2rem 0",
              }}
            >
              <Typography
                variant="overline"
                component="h1"
                style={{ margin: "0", fontSize: "1.5rem" }}
              >
                <span style={{ marginRight: ".25ch", fontSize: "2.5rem", lineHeight: '1', position: 'relative', top: '.125em' }} role="img" aria-label="books emoji"> 📚 </span>
                Make Me a Library!
              </Typography>
            </Box>

            <ImageCapture setTableData={setTableData} tableData={tableData} />
            { tableData.length > 0 && <BookTable data={tableData} /> }
          </Box>
        </Typography>
      </Container>
    </div>
  );
}

export default App;
