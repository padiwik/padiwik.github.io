---
layout: page
title: Word Engine Converter
permalink: /puzzles/words
---

<link rel="stylesheet" href="/assets/css/words.css">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet">

Modify any of the text boxes below, and the page will automatically update with the queries for each word engine.

You might need to allow pop-ups on this site for the Open all link to work.

Guess<span id="guessType" style="display: none, cursor: pointer"></span>: <a id="guessLink" style="display:none; cursor:pointer" href="#" class="bodylink">Open all</a><span id="guessLabel" style="display: none"></span>

<input id="guess" class="wordinput" autofocus>

Onelook: <a id="onelookLink" target="_blank" style="display: none" class="bodylink">Open query</a><span id="onelookLabel" style="display: none"></span>

<input id="onelook" class="wordinput">

Qat: <a id="qatLink" target="_blank" style="display: none" class="bodylink">Open query</a><span id="qatLabel" style="display: none"></span>

<input id="qat" class="wordinput">

Nutrimatic: <a id="nutrimaticLink" target="_blank" style="display: none" class="bodylink">Open query</a><span id="nutrimaticLabel" style="display: none"></span>

<input id="nutrimatic" class="wordinput">

# About tools:

Onelook
* Words and English phrases
* Sorts results by frequency
* Can filter by part of speech
* Can filter by meaning, e.g. `a*:fruit` to find `apple`.

Qat:
* Single words with multiple dictionaries
* Supports advanced equation solving

Nutrimatic:
* Generated phrases from words in Wikipedia articles
* Often leads to garbage results, especially when looking for a single word or a phrase with few constraints

# Syntax (as implemented here):

| Pattern | [Onelook](https://www.onelook.com/?c=faq#patterns){: class="tablelink"}| [Qat](https://www.quinapalus.com/qat.html){: class="tablelink"} | [Nutrimatic](https://nutrimatic.org/){: class="tablelink"} |
|---|---|---|---|
| Single letter | `?` | `.` | `A` |
| Consonant | `#` | `#` | `C` |
| Vowel | `@` | `@` | `V` |
| 0 or more letters | `*` | `*` | `A*` |
| Anagram | | `/letters` | `<letters>` |
| Choose a letter | | `[letters]` | `[letters]` | 

<script src="{{ base.url | prepend: site.url }}/assets/words.js"></script>
