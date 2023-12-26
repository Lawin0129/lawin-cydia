document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
        displayFileSize(file);
        calculateChecksums(file);
    }
}

function displayFileSize(file) {
    const fileSize = file.size;
    document.getElementById('size').textContent = fileSize;
}

async function calculateChecksums(file) {
    const buffer = await readFileAsync(file);

    const md5 = calculateMD5(buffer);
    const sha1 = await calculateHash(buffer, 'SHA-1');
    const sha256 = await calculateHash(buffer, 'SHA-256');

    document.getElementById('md5').textContent = md5;
    document.getElementById('sha1').textContent = sha1;
    document.getElementById('sha256').textContent = sha256;
}

function calculateMD5(buffer) {
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(buffer);
    return spark.end();
}

async function calculateHash(buffer, algorithm) {
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (event) => {
            reject(new Error('Error reading file: ' + event.target.error));
        };

        reader.readAsArrayBuffer(file);
    });
}