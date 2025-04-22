export function Meep() {
    const downloadPDF = async () => {
        const response = await fetch('http://localhost:3000/absendo/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: '2025-04-07',
                user_id: '0ca88958-17cb-42da-8600-3c57f5e10ae6',
                reason: 'Arzttermin',
                is_excused: true
            })
        })

        if (!response.ok) {
            alert('Failed to download PDF');
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filled-formdfd.pdf';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <button onClick={downloadPDF}>Download PDF</button>
        </>
    );
}
