import {
  Box,
  Button,
  TextareaAutosize,
  Typography
} from '@material-ui/core';
import React, { useRef, useState } from 'react';

import MatchedTable from './matched-table';

const BookEntryForm = React.memo(({ data, textInput, setTextInput }) => {
  const [matched] = useState([]);
  const [formHidden, setFormHidden] = useState(false);
  const codeForm = useRef(null);

  const haveResults = matched.length >= 1;

  const boxStyles = {
    borderBottom: '2rem',
    height: '100%',
    position: 'relative',
    width: '100%',
  };

  const btnStyles = {
    margin: '2rem 1rem 0 0',
    maxWidth: '50%',
  };

  const hiddenBoxStyles = {
    marginBottom: '2rem',
    maxHeight: '75vh',
    opacity: '1',
    overflow: 'hidden',
    transition: 'max-height 0.33s ease-in-out, opacity 0.33s ease-in-out',
    width: '100%',
  };

  const hideBtnStyles = {
    bottom: '3rem',
    opacity: haveResults ? '1' : '0',
    pointerEvents: haveResults ? 'auto' : 'none',
    position: 'absolute',
    right: '0',
    transition: 'opacity 0.33s ease-in-out',
    whiteSpace: 'nowrap',
    width: 'auto',
  };

  // const handleSubmit = (ev) => {
  //   ev.preventDefault();

  //   const clean = (str) => str.trim().toLowerCase();

  //   // split on line breaks
  //   const valArr = textInput.split(/\r?\n/);
  //   // filter out duplicates
  //   const cleanedArray = valArr.map((x) => clean(x)).filter(Boolean);
  //   const cleanValuesArray = [...new Set(cleanedArray)];
  //   const bookDataArray = getBookData(cleanValuesArray);

  //   setMatched(bookDataArray);
  // };

  const handleHideFormClick = () => {
    codeForm.current.style.maxHeight = formHidden ? '75vh' : '0';
    codeForm.current.style.opacity = formHidden ? '1' : '0';
    setFormHidden(!formHidden);
  };

  // reset all the things!
  const resetPage = () => {
    setTextInput('');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // onSubmit={handleSubmit}
  return (
    <>
      <form noValidate autoComplete="off">
        <Box style={boxStyles} display="flex" justifyContent="space-between" flexDirection="row" color="text.primary">
          <Button variant="contained" size="medium" color="secondary" className="button-hideform" style={hideBtnStyles} onClick={handleHideFormClick}>
            {
              formHidden
              ? <span style={{marginRight: '1ch'}} role="img" aria-label="nerd face emoji"> 🤓 </span>
              : <span style={{marginRight: '1ch'}} role="img" aria-label="see on evil emoji"> 🙈 </span>
            }
            { formHidden ? 'Show' : 'Hide' } form
          </Button>
          <Box color="text.primary" display="flex" justifyContent="flex-start" flexDirection="column" style={hiddenBoxStyles} ref={codeForm}>
            <Typography variant="overline" display="block" style={{ textAlign: 'left', marginRight: 'auto', fontWeight: 'bold' }}>
              ISBNs go here
              (<span style={{ fontSize: '1.25em' }} role="img" aria-label="siren emoji">🚨</span>
                one per line!)
            </Typography>

            <TextareaAutosize
              autoFocus={true}
              id="unloader"
              minRows={20}
              variant="outlined"
              value={textInput}
              // onChange={
              //   (ev) => setTextInput(ev.target.value)
              // }
              style={{
                backgroundColor: 'rgba(221, 221, 221, .25)',
                borderColor: '#ddd',
                color: '#000',
                display: 'block',
                padding: '1rem',
                outlineColor: '#666',
                width: '100%',
              }}
            />

            <Box display="flex" justifyContent="flex-start" flexDirection="row">
              <Button
                variant="contained"
                size="large"
                color="primary"
                style={btnStyles}
                type="submit"
                disabled={textInput?.length < 1 || textInput === ''}
              >
                <span style={{ fontSize: '1.25rem' }} role="img" aria-label="magnifying glass emoji"> 🔍</span>
                &nbsp;
                Search
              </Button>

              <Button
                variant="outlined"
                size="large"
                color="default"
                style={btnStyles}
                type="button"
                disabled={textInput.length < 1 || textInput === ''}
                onClick={resetPage}
              >
                <span style={{ fontSize: '1.25rem' }} role="img" aria-label="broom emoji"> 🧹 </span>
                &nbsp;
                Reset Page
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
      <Box style={{ paddingBottom: '5rem' }}>
        {
          matched.length > 0
          ? <MatchedTable
              matches={matched}
            />
          : null
        }
      </Box>
    </>
  );
});

export default BookEntryForm;
