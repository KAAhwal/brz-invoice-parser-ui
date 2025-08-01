document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const fileInput = form.file;
  const vendor = form.vendor.value;
  const message = document.getElementById('message');
  message.textContent = '';

  if (!vendor || !fileInput.files.length) {
    message.textContent = 'Please select a vendor and upload a .zip file.';
    return;
  }

  const formData = new FormData();
  formData.append('vendor', vendor);
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('https://brz-invoice-parser.onrender.com/parse', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to parse invoice.');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parsed_output.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    message.textContent = '✅ Download started!';
  } catch (err) {
    message.textContent = '❌ Error: ' + err.message;
  }
});