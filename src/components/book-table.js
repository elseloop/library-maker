import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, {useState} from 'react';

import { useSnackbar } from 'notistack';

export default function BookTable({data}) {
  const [inFlight, setInFlight] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const maybePluralCode = data.length === 1 ? 'Book' : 'Books';

  const handleAddClick = (event) => {
    event.preventDefault();

    const msg = data?.length > 1 ? `${data?.length} new books added.` : `One new book added.`;

    // fake a roundtrip to the DB...
    setInFlight(true);

    setTimeout(() => {
      enqueueSnackbar(msg, {
        variant: 'success',
        preventDuplicate: true
      });
      setInFlight(false);
    }, 1000);
  };

  return (
    <Box className="table--books">
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="books emoji"> 📚 </span>
                ISBN
              </TableCell>
              <TableCell>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="red textbook emoji"> 📕 </span>
                Title
              </TableCell>
              <TableCell>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="nerd face emoji"> 🤓 </span>
                Author
              </TableCell>
              <TableCell>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="printer emoji"> 🖨 </span>
                Publisher
              </TableCell>
              <TableCell>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="calendar emoji"> 📆 </span>
                Year Published
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((book, idx) => {
              return (
                <TableRow
                  hover
                  key={book.isbn}
                >
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.yearPublished}</TableCell>
                </TableRow>
              )}
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        size="large"
        color="primary"
        style={{ maxWidth: 'calc(50% - 2rem)', margin: '2rem 1rem 0 0' }}
        type="button"
        onClick={handleAddClick}
        disabled={inFlight}
      >
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} role="img" aria-label="plus sign emoji">＋</span>
        &nbsp;
        {`Add ${data.length} New ${maybePluralCode}`}
      </Button>
    </Box>
  )
};
