// utils/runSecureScript.js
export async function runSecureScript(scriptName) {
  const res = await fetch('http://localhost:5000/api/run-script', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: process.env.REACT_APP_SCRIPT_RUNNER_TOKEN,
      file: scriptName,
    }),
  });

  const data = await res.json();
  return data;
}
