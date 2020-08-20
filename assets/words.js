const guessInput = document.getElementById('guess');
const guessType = document.getElementById('guessType');
const guessLabel = document.getElementById('guessLabel');
const guessLink = document.getElementById('guessLink');

const processError = 'Could not process query.';

const onelook = {
  input: document.getElementById('onelook'),
  label: document.getElementById('onelookLabel'),
  link: document.getElementById('onelookLink'),
  isValidText: (text) => text.match(/^[?#@*a-z() ]+$/),
  name: 'Onelook',
};
const qat = {
  input: document.getElementById('qat'),
  label: document.getElementById('qatLabel'),
  link: document.getElementById('qatLink'),
  isValidText: (text) => text.match(/^[.#@*a-z()/[\]]+$/),
  name: 'Qat',
};
const nutrimatic = {
  input: document.getElementById('nutrimatic'),
  label: document.getElementById('nutrimaticLabel'),
  link: document.getElementById('nutrimaticLink'),
  isValidText: (text) => text.match(/^[ACV*a-z()<>[\] ]+$/),
  name: 'Nutrimatic',
};

const engines = [onelook, qat, nutrimatic];

// Set the public-facing value for the engine in Guess
function setGuessType(engineText) {
  if (engineText === '') {
    guessType.style.display = 'none';
  } else {
    guessType.innerHTML = ` (${engineText})`;
    guessType.style.display = 'inline';
  }
}

function setWarning(isTrue, engine) {
  if (isTrue) {
    engine.label.style.display = 'inline';
    engine.label.innerHTML = `Could not convert to valid ${engine.name} query.`;
    engine.link.style.display = 'none';
  } else {
    engine.label.style.display = 'none';
    engine.link.style.display = 'inline';
  }
}

function setLinksVisible(isVisible) {
  const links = [onelook.link, qat.link, nutrimatic.link, guessLink];
  links.forEach((link) => {
    if (isVisible) {
      link.style.display = 'inline';
    } else {
      link.style.display = 'none';
    }
  });
}

function setLabelsVisible(isVisible) {
  engines.forEach((engine) => {
    if (isVisible) {
      engine.label.style.display = 'block';
    } else {
      engine.label.style.display = 'none';
    }
  });
}

function processText(text, engine) {
  let onelookText = '';
  let qatText = '';
  let nutrimaticText = '';
  let prevString = ''; // Used when parsing e.g. * in qat queries
  let onelookInvalid = false; // true if this cannot be made into a valid onelook query
  let qatInvalid = false;
  let anagramming = false; // true if we are currently in an anagram
  let nestedLevel; // tally of parentheses after qat anagram indicator
  const charsArray = text.split('');
  charsArray.forEach((character) => {
    let onelookAppend;
    let qatAppend;
    let nutrimaticAppend;
    switch (engine) {
      case onelook:
        qatAppend = character;
        nutrimaticAppend = character;
        switch (character) {
          case '?':
            qatAppend = '.';
            nutrimaticAppend = 'A';
            break;
          case '#':
            qatAppend = '#';
            nutrimaticAppend = 'C';
            break;
          case '@':
            qatAppend = '@';
            nutrimaticAppend = 'V';
            break;
          case '*':
            qatAppend = '*';
            nutrimaticAppend = 'A*';
            break;
          case ' ':
            qatInvalid = true;
            nutrimaticAppend = ' ';
            break;
          default:
            // do nothing
        }
        onelookText = onelookText.concat(character);
        qatText = qatText.concat(qatAppend);
        nutrimaticText = nutrimaticText.concat(nutrimaticAppend);
        break;
      case qat:
        onelookAppend = character;
        nutrimaticAppend = character;
        switch (character) {
          case '.':
            onelookAppend = '?';
            nutrimaticAppend = 'A';
            break;
          case '#':
            onelookAppend = '#';
            nutrimaticAppend = 'C';
            break;
          case '@':
            onelookAppend = '@';
            nutrimaticAppend = 'V';
            break;
          case '*':
            onelookAppend = '*';
            nutrimaticAppend = 'A*';
            break;
          case '/':
            onelookInvalid = true;
            nutrimaticAppend = '<';
            // anagrams inside anagrams are illegal, so don't worry about that
            anagramming = true;
            nestedLevel = 0;
            break;
          case '(':
            nestedLevel += 1;
            break;
          case ')':
            nestedLevel -= 1;
            if (nestedLevel < 0) {
              // this is the end of a grouped expression; stop the anagram
              nutrimaticAppend = '>)';
              anagramming = false;
            }
            break;
          case '[':
          case ']':
            onelookInvalid = true;
            break;
          default:
            // do nothing
        }
        prevString = character;
        onelookText = onelookText.concat(onelookAppend);
        qatText = qatText.concat(character);
        nutrimaticText = nutrimaticText.concat(nutrimaticAppend);
        break;
      case nutrimatic:
        onelookAppend = character;
        qatAppend = character;
        switch (character) {
          case 'A':
            onelookAppend = '?';
            qatAppend = '.';
            break;
          case 'C':
            onelookAppend = '#';
            qatAppend = '#';
            break;
          case 'V':
            onelookAppend = '@';
            qatAppend = '@';
            break;
          case '*':
            if (prevString === 'A') {
              // Remove the lone character, because we could have none
              onelookText = onelookText.slice(0, -1);
              qatText = qatText.slice(0, -1);
              onelookAppend = '*';
              qatAppend = '*';
            } else {
              onelookInvalid = true;
              qatInvalid = true;
            }
            break;
          case '<':
            onelookInvalid = true;
            qatAppend = '(/';
            break;
          case '>':
            // onelookInvalid is already set above
            qatAppend = ')';
            break;
          case '[':
          case ']':
            onelookInvalid = true;
            qatAppend = character;
            break;
          case ' ':
            onelookAppend = ' ';
            qatInvalid = true;
            break;
          default:
            // do nothing
        }
        prevString = character;
        onelookText = onelookText.concat(onelookAppend);
        qatText = qatText.concat(qatAppend);
        nutrimaticText = nutrimaticText.concat(character);
        break;
      default:
        // Should never happen
    }
  });
  if (anagramming) {
    // Finish the anagram
    nutrimaticText = nutrimaticText.concat('>');
  }
  if (!onelookInvalid) {
    onelook.input.value = onelookText;
    onelook.link.href = `https://onelook.com/?ssbp=1&w=${onelookText}`;
  }
  if (!qatInvalid) {
    qat.input.value = qatText;
    qat.link.href = `https://www.quinapalus.com/cgi-bin/qat?pat=${qatText}`;
  }
  nutrimatic.input.value = nutrimaticText;
  nutrimatic.link.href = `https://nutrimatic.org/?q=${nutrimaticText}`;
  setLabelsVisible(false);
  setLinksVisible(true);
  setWarning(onelookInvalid, onelook);
  setWarning(qatInvalid, qat);
}

guessInput.addEventListener('input', () => {
  const guessText = guessInput.value;
  setLinksVisible(true);
  if (onelook.isValidText(guessText)) {
    processText(guessText, onelook);
    setGuessType(onelook.name);
  } else if (qat.isValidText(guessText)) {
    processText(guessText, qat);
    setGuessType(qat.name);
  } else if (nutrimatic.isValidText(guessText)) {
    processText(guessText, nutrimatic);
    setGuessType(nutrimatic.name);
  } else {
    if (guessText === '') {
      processText('', onelook); // Clear all the input fields
      guessLabel.style.display = 'none';
    } else {
      guessLabel.innerHTML = processError;
      guessLabel.style.display = 'inline';
    }
    setLinksVisible(false);
    setGuessType('');
    return;
  }
  guessLabel.style.display = 'none';
});

function inputHandler(engine) {
  // Clear the guess input
  guessInput.value = '';
  guessLabel.style.display = 'none';
  const text = engine.input.value;
  if (engine.isValidText(text)) {
    processText(text, engine);
    engine.label.style.display = 'none';
    return;
  }
  // This input is invalid
  if (text === '') {
    processText('', onelook); // Clear all the input fields
    engine.label.style.display = 'none';
  } else {
    engine.label.innerHTML = processError;
    engine.label.style.display = 'inline';
  }
  setLinksVisible(false);
}

engines.forEach((engine) => {
  engine.input.addEventListener('input', () => {
    inputHandler(engine);
  });
  engine.input.onfocus = () => {
    inputHandler(engine);
  };
});

// Handle the "Open all" link
guessLink.addEventListener('click', (e) => {
  e.preventDefault();
  engines.forEach((engine) => {
    if (engine.link.style.display !== 'none') {
      window.open(engine.link.href);
    }
  });
});
