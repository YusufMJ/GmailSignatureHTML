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
        <table style="color: black;width: 600px;">
            <tr>
                <td colspan="2" style="padding-top: 20px; text-align: end;">
                    <img style="width: 100px;" src="https://new.raincode.se/wp-content/uploads/2024/07/Raincode.png" alt="raincode logo">
                </td>
            </tr>
        </table>
        <table style="color: black;font-family: 'sans-serif', Arial, sans-serif; margin-left: 20px; max-width: 600px; background-color: #ffffff; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 240px;">
                        <div style="display: inline-block; padding: 10px 10px 7px 10px; background: linear-gradient(to bottom, #5BD091, #4075C1); border-radius: 50%;">
                            <img src="${imageUrl}" alt="Profile Picture" style="border-radius: 50%; height: 200px; width: 200px;"/>
                        </div>
                    </td>
                    
                    <td>
                        <div style="font-size: 43.2px; font-weight: 900; line-height: 43.2px; word-break: break-all;">${name}
                            <div style="font-size: 24.9px; font-weight: 500; margin-bottom: 20px; line-height: 24.9px;">&nbsp;${jobTitle}</div>
                        </div>
                        <div style="font-size: 11.1px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" style="color: black;border-collapse: collapse;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 10px;">
                                        <img style="width: 16px; height: 16px;" src="https://new.raincode.se/wp-content/uploads/2024/08/phone-24px.png" alt="phone icon">
                                    </td>
                                    <td style="vertical-align: middle; text-transform: uppercase;">
                                        ${phone}
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" cellspacing="0" cellpadding="0" style="color: black;border-collapse: collapse; margin-top: 5px;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 10px;">
                                        <img style="width: 16px; height: 16px;" src="https://new.raincode.se/wp-content/uploads/2024/09/Union.png" alt="globe icon">
                                    </td>
                                    <td style="vertical-align: middle; text-transform: uppercase;">
                                        <a href="https://${website}" style="text-decoration: none;">${website}</a>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" cellspacing="0" cellpadding="0" style="color: black;border-collapse: collapse; margin-top: 5px;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 10px;">
                                        <img style="width: 16px;" src="https://new.raincode.se/wp-content/uploads/2024/08/Vector.png" alt="location icon">
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