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
        const apikey = document.getElementById('apikey').value;
        const imageFile = document.getElementById('image').files[0];

        const imageUrl = await uploadImageToImgBB(imageFile, apikey);
        const signatureHTML = `
<table style="color: black; width: 400px; background-color: #ffffff;">
    <tr>
        <td colspan="2" style="padding-top: 13.33px; text-align: end;">
            <img style="width: 66.67px;" src="https://i.ibb.co/1GPtyPn/unnamed-6.png" alt="Raincode">
        </td>
    </tr>
</table>

<table style="color: black; font-family: 'sans-serif', Arial, sans-serif; width: 400px; background-color: #ffffff; border-collapse: collapse;">
    <tbody>
        <tr>
            <td style="width: 160px;">
                <div style="display: inline-block; padding: 6.67px 6.67px 0px 6.67px; background: linear-gradient(to bottom, #5BD091, #4075C1); border-radius: 50%;">
                    <img href=”” style=”cursor:default;” src="${imageUrl}" alt="Image" style="border-radius: 50%; height: 133.33px; width: 133.33px;"/>
                </div>
            </td>
            
            <td style="padding-left: 20px;">
                <div style="font-size: 28.8px; font-weight: 900; line-height: 28.8px; width: 400px;">${name}</div>
                <div style="font-size: 16.6px; font-weight: 500; margin-bottom: 13.33px; line-height: 16.6px; padding-left: 2px;">${jobTitle}</div>
                <div style="font-size: 9.4px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" style="color: black; border-collapse: collapse;">
                        <tr>
                            <td style="vertical-align: middle; padding-right: 6.67px;">
                                <img style="width: 16px; height: 16px;" src="https://i.ibb.co/WpZxtmm/unnamed.png" alt="📞">
                            </td>
                            <td style="vertical-align: middle; text-transform: uppercase;">
                                ${phone}
                            </td>
                        </tr>
                    </table>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="color: black; border-collapse: collapse; margin-top: 3.33px;">
                        <tr>
                            <td style="vertical-align: middle; padding-right: 6.67px;">
                                <img style="width: 16px; height: 16px;" src="https://i.ibb.co/1sL5V7T/unnamed-5.png" alt="🌐">
                            </td>
                            <td style="vertical-align: middle; text-transform: uppercase;">
                                <a href="https://${website}" style="text-decoration: none; color: #000;">${website}</a>
                            </td>
                        </tr>
                    </table>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="color: black; border-collapse: collapse; margin-top: 3.33px;">
                        <tr>
                            <td style="vertical-align: middle; padding-right: 6.67px;">
                                <img style="width: 16px;" src="https://i.ibb.co/rxDknFn/unnamed-2.png" alt="📍">
                            </td>
                            <td style="vertical-align: middle; text-transform: uppercase;">
                                ${location}
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </tbody>
</table>

    `;

        signatureContent.innerHTML = signatureHTML;
    }

    async function uploadImageToImgBB(imageFile, apiKey) {
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
