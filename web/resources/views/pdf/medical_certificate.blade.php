<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Certificate</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            margin-top: 20px;
        }
        .field {
            margin-bottom: 15px;
        }
        .field span {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Medical Certificate</h2>
    </div>
    <div class="content">
        <div class="field"><span>Doctor:</span> {{ $certificate->doctor_name }}</div>
        <div class="field"><span>Patient:</span> {{ $certificate->patient_name }}</div>
        <div class="field"><span>Purpose:</span> {{ $certificate->purpose }}</div>
        <div class="field"><span>Examine Date:</span> {{ $certificate->examin_date }}</div>
        <div class="field"><span>Issued Date:</span> {{ $certificate->issue_date }}</div>
    </div>
</body>
</html>
