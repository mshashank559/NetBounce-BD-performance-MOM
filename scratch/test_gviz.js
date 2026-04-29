
import fetch from 'node-fetch';

const SHEET_ID = '1Qh4VMze8D64Wqbzz2UQo2zxsKYfMCZf_gzXaZVfa5Fg';

async function test() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
  const response = await fetch(url);
  const text = await response.text();
  console.log(text.substring(0, 1000));
}

test();
