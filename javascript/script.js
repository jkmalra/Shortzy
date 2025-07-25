document.getElementById('shortenBtn').addEventListener('click', async function () {
    const longUrl = document.getElementById('longUrl').value.trim();

    if (!longUrl) {
        alert('Please enter a URL');
        return;
    }

    const button = document.getElementById('shortenBtn');
    button.textContent = 'Processing...';
    button.disabled = true;

    const data = {
        originalUrl: longUrl
    };

    try {
        const response = await fetch('http://localhost:8080/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to shorten URL');

        const result = await response.json();

        const shortUrl = result.shortUrl;
        const shortCode = shortUrl.split('/').pop(); // Extract short code

        // Set base info from response
        document.getElementById('shortUrl').textContent = shortUrl;
        document.getElementById('originalUrl').textContent = "Original URL: " + result.originalUrl;
        document.getElementById('createdAt').textContent = "Created At: " + new Date(result.createdAt).toLocaleString();

        // Fetch actual click count from backend (live)
        fetch(`http://localhost:8080/api/clicks/${shortCode}`)
            .then(res => res.json())
            .then(clickCount => {
                document.getElementById('clickCount').textContent = "Clicks: " + clickCount;
            })
            .catch(() => {
                document.getElementById('clickCount').textContent = "Clicks: N/A";
            });

        // Show result
        document.getElementById('resultContainer').style.display = 'block';

    } catch (err) {
        alert(err.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Shorten';
    }
});

document.getElementById('copyBtn').addEventListener('click', function () {
    const shortUrl = document.getElementById('shortUrl').textContent;

    navigator.clipboard.writeText(shortUrl)
        .then(() => {
            const btn = document.getElementById('copyBtn');
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = 'Copy';
            }, 2000);
        })
        .catch(() => {
            alert('Could not copy URL');
        });
});
