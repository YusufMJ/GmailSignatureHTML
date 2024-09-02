const loadingAnimation = document.getElementById('loadingAnimation');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signatureForm');
    const signaturePreview = document.getElementById('signaturePreview');
    const signatureContent = document.getElementById('signatureContent');
    const copyButton = document.getElementById('copySignature');
    const downloadButton = document.getElementById('downloadSignature');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading animation
        loadingAnimation.classList.remove('hidden');
        
        // Hide the form
        form.classList.add('hidden');
        
        try {
            await generateSignature();
            // When signature generation is complete, show the preview
            signaturePreview.classList.remove('hidden');
        } catch (error) {
            console.error('Error generating signature:', error);
            alert('An error occurred while generating the signature. Please try again.');
        } finally {
            // Hide loading animation
            loadingAnimation.classList.add('hidden');
            
            // Show the form again
            form.classList.remove('hidden');
        }
    });

    copyButton.addEventListener('click', copySignature);
    downloadButton.addEventListener('click', downloadSignature);

    async function generateSignature() {
        const name = document.getElementById('name').value;
        const jobTitle = document.getElementById('jobTitle').value;
        const phone = document.getElementById('phone').value;
        const website = document.getElementById('website').value;
        const location = document.getElementById('location').value;
        const company = document.getElementById('company').value;
        const imageFile = document.getElementById('image').files[0];

        const imageUrl = await uploadImageToImgBB(imageFile);
        alert(imageUrl);
        const signatureHTML = `
            <table style="font-family: 'Noto Sans', sans-serif; color: #191919; border-collapse: collapse;">
                <tr>
                    <td style="padding-right: 15px; vertical-align: top;">
                        <img src="${imageUrl}" alt="${name}" style="width: 100px; height: 100px; border-radius: 50%;">
                    </td>
                    <td style="border-left: 2px solid #5BD091; padding-left: 15px; vertical-align: top;">
                        <strong style="font-size: 18px; color: #4075C1;">${name}</strong><br>
                        <span style="font-size: 14px; color: #5BD091;">${jobTitle}</span><br>
                        <span style="font-size: 14px;">${company}</span><br>
                        <br>
                        <span style="font-size: 14px;">${phone}</span><br>
                        <a href="${website}" style="color: #5BD091; text-decoration: none; font-size: 14px;">${website}</a><br>
                        <span style="font-size: 14px;">${location}</span>
                    </td>
                </tr>
            </table>
        `;

        signatureContent.innerHTML = signatureHTML;
    }

    async function uploadImageToImgBB(imageFile) {
        const apiKey = '695f26b91e2206d6b101bda825693a80';
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image to ImgBB');
        }

        const data = await response.json();
        return data.data.url;
    }

    function copySignature() {
        const range = document.createRange();
        range.selectNode(signatureContent);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }

    function downloadSignature() {
        html2canvas(signatureContent, {
            backgroundColor: '#ffffff'
        }).then(function(canvas) {
            const link = document.createElement('a');
            link.download = 'gmail_signature.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    }
});