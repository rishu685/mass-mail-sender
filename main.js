document.getElementById('emailListUpload').addEventListener('change', () => {
  let fr = new FileReader();
  fr.readAsText(document.getElementById('emailListUpload').files[0]);

  fr.onload = function () {
    let rows = fr.result.split(/\r?\n|\n/).map(row => row.split(','));
    window.valNo = 0;
    let invalNo = 0;
    window.valMail = [];

    document.querySelector("table#val").innerHTML = ""; // clear table

    rows.forEach(e => {
      if (e.join('').trim() === '') return;

      const email = e[0].trim();
      const isValid = isValidEmail(email);
      const rowHtml = e.map(cell => `<td>${cell}</td>`).join('');

      const rowEl = document.createElement("tr");
      rowEl.innerHTML = rowHtml;

      document.querySelector("table#val").appendChild(rowEl);

      if (isValid) {
        window.valMail.push(email);
        window.valNo++;
      } else {
        invalNo++;
      }
    });

    document.querySelector('#valcount').innerText = window.valNo;
    document.querySelector('#invalCount').innerText = invalNo;
  };
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendEmail() {
  const subject = document.getElementById('subject').value;
  const body = document.getElementById('msg').value;
  const from = document.getElementById('from').value;
  const fileInput = document.getElementById('attachmentUpload');

  const emailList = window.valMail || [];

  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      const base64 = reader.result.split(',')[1];

      Email.send({
        SecureToken: "YOUR_SMTPJS_SECURE_TOKEN",
        To: emailList.join(','),
        From: from,
        Subject: subject,
        Body: body,
        Attachments: [{
          name: fileInput.files[0].name,
          data: base64
        }]
      }).then(
        message => alert(emailList.length + " emails sent successfully.\nResponse: " + message)
      );
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    Email.send({
      SecureToken: "YOUR_SMTPJS_SECURE_TOKEN",
      To: emailList.join(','),
      From: from,
      Subject: subject,
      Body: body
    }).then(
      message => alert(emailList.length + " emails sent successfully.\nResponse: " + message)
    );
  }
}
