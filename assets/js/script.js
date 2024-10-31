// Utility functions
const $ = id => document.getElementById(id);
const showToast = message => {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
};

// Navigation and scroll handling
function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    const progressBar = document.querySelector('.progress-bar');

    const smoothScroll = target => {
        const targetSection = document.querySelector(target);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    };

    const updateNavigation = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        progressBar.style.width = `${(scrollPosition / (documentHeight - windowHeight)) * 100}%`;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
                });
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            smoothScroll(e.target.getAttribute('href'));
        });
    });

    window.addEventListener('scroll', updateNavigation);
    updateNavigation();
}

// Steganography demo functionality
function initSteganographyDemo() {
    const messageInput = $('messageInput');
    const charBreakdown = $('charBreakdown');
    const originalPixels = $('originalPixels');
    const modifiedPixels = $('modifiedPixels');
    const originalImage = $('originalImage');
    const modifiedImage = $('modifiedImage');
    const originalValues = $('originalValues');
    const modifiedValues = $('modifiedValues');

    const textToBinary = char => char.charCodeAt(0).toString(2).padStart(8, '0');

    const updateDemo = text => {
        // Character breakdown
        charBreakdown.innerHTML = text.split('').map(char => `
            <div class="char-row">
                <div class="char-label">Character '${char}'</div>
                <div class="binary-value">${textToBinary(char)}</div>
            </div>
        `).join('');

        // Sample RGB values
        const originalRGB = [
            [128, 128, 128],
            [130, 130, 130],
            [126, 126, 126]
        ];

        // Update original pixels
        originalPixels.innerHTML = originalRGB.flat().map(value => `
            <div class="pixel">
                <div class="pixel-value">${value}</div>
                <div class="pixel-bit">${value & 1}</div>
            </div>
        `).join('');

        // Convert text to bits and modify pixels
        const bits = text.split('').map(char => textToBinary(char)).join('');
        const modifiedRGB = originalRGB.map(pixel => 
            pixel.map((value, i) => (value & ~1) | (bits[i] === '1' ? 1 : 0))
        );

        // Update modified pixels
        modifiedPixels.innerHTML = modifiedRGB.flat().map((value, i) => `
            <div class="pixel">
                <div class="pixel-value">${value}</div>
                <div class="pixel-bit ${value & 1 !== originalRGB.flat()[i] & 1 ? 'modified' : ''}">${value & 1}</div>
            </div>
        `).join('');

        // Update comparison
        originalImage.style.background = `rgb(${originalRGB[0].join(',')})`;
        modifiedImage.style.background = `rgb(${modifiedRGB[0].join(',')})`;
        originalValues.textContent = `RGB: (${originalRGB[0].join(', ')})`;
        modifiedValues.textContent = `RGB: (${modifiedRGB[0].join(', ')})`;
    };

    messageInput.addEventListener('input', e => updateDemo(e.target.value));
    updateDemo('');
}

// Code copy functionality
function initCodeCopy() {
    document.querySelectorAll('pre code').forEach(codeBlock => {
        const wrapper = codeBlock.parentNode;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        
        copyButton.onclick = () => {
            const text = codeBlock.textContent;
            
            if (!navigator.clipboard) {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast('Code copied to clipboard!');
                } catch (err) {
                    showToast('Failed to copy code');
                }
                document.body.removeChild(textArea);
                return;
            }
            
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('Code copied to clipboard!');
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => copyButton.textContent = 'Copy', 2000);
                })
                .catch(() => showToast('Failed to copy code'));
        };
        
        wrapper.appendChild(copyButton);
    });
}

// Interactive example functionality
function initInteractiveExample() {
    const decodeBtn = $('decodeExampleBtn');
    const output = $('exampleOutput');
    let isDecoded = false;

    decodeBtn.addEventListener('click', () => {
        if (!isDecoded) {
            output.textContent = 'Decoding';
            let dots = 0;
            const loadingInterval = setInterval(() => {
                output.textContent = 'Decoding' + '.'.repeat(dots);
                dots = (dots + 1) % 4;
            }, 200);

            setTimeout(() => {
                clearInterval(loadingInterval);
                output.innerHTML = '<span class="decoded">Decoded message: "Hire me."</span>';
                isDecoded = true;
                decodeBtn.textContent = 'Reset';
            }, 1500);
        } else {
            output.textContent = 'Click "Decode Message" to reveal the hidden message';
            decodeBtn.textContent = 'Decode Message';
            isDecoded = false;
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSteganographyDemo();
    initCodeCopy();
    initInteractiveExample();
});
