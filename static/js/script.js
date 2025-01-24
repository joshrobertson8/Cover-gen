document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('coverForm');
    const generateBtn = document.querySelector('.generate-btn');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('resume');
    const jobDescription = document.getElementById('job_description');
    const resultSection = document.getElementById('result');
    const coverLetterContent = document.getElementById('coverLetterContent');

    // Initialize Event Listeners
    form.addEventListener('submit', handleSubmit);
    setupDragDrop(dropZone, fileInput);
    setupFileInput(fileInput, dropZone);
    setupScrollAnimations();
    setupParallax();

    // Fix textarea flicker
    let isDragging = false;

    jobDescription.addEventListener('mouseenter', () => {
        if (!isDragging) {
            dropZone.style.pointerEvents = 'none';
        }
    });

    jobDescription.addEventListener('mouseleave', () => {
        dropZone.style.pointerEvents = 'auto';
    });

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(form);

        // Clear previous result
        coverLetterContent.innerHTML = '';
        resultSection.classList.add('hidden');

        // Validate inputs
        const files = fileInput.files;
        if (!files || files.length === 0) {
            showError('Please select a resume file');
            return;
        }

        const jobDesc = formData.get('job_description').trim();
        if (jobDesc.length < 200) {
            showError('Please provide a detailed job description (at least 200 characters)');
            return;
        }

        try {
            // Update UI state
            generateBtn.disabled = true;
            generateBtn.innerHTML = `
                <span class="btn-text">Analyzing Files</span>
                <div class="loading-spinner"></div>
            `;

            // Show analyzing state
            showAnalyzingState();

            // Add the file to FormData explicitly
            formData.append('resume', files[0]);

            // API Request
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                showResult(data.cover_letter);
            } else {
                showError(data.error);
            }
        } catch (error) {
            showError(error.message);
        } finally {
            // Reset UI state
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <span class="btn-text">Generate Cover Letter</span>
                <div class="btn-gradient"></div>
            `;
        }
    }

    function showAnalyzingState() {
        resultSection.classList.remove('hidden');
        coverLetterContent.innerHTML = `
            <div class="analyzing-state">
                <div class="analyzing-loader"></div>
                <div class="analyzing-text">Analyzing your resume and job description...</div>
            </div>
        `;
        resultSection.classList.add('active');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showResult(content) {
        coverLetterContent.innerHTML = content;

        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = `
            <span>Download Cover Letter</span>
            <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
        `;

        // Add download functionality
        downloadBtn.addEventListener('click', () => {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CoverLetter_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });

        // Replace download button
        const resultHeader = document.querySelector('.result-header');
        resultHeader.querySelector('.download-btn')?.remove();
        resultHeader.appendChild(downloadBtn);
    }

    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        document.body.appendChild(errorEl);

        setTimeout(() => {
            errorEl.remove();
        }, 3000);
    }

    function setupDragDrop(dropZone, fileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);

        dropZone.addEventListener('dragstart', () => {
            isDragging = true;
            dropZone.style.pointerEvents = 'auto';
        });

        dropZone.addEventListener('dragend', () => {
            isDragging = false;
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            dropZone.classList.add('dragging');
        }

        function unhighlight(e) {
            dropZone.classList.remove('dragging');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                const validTypes = ['application/pdf', 'text/plain'];
                const file = files[0];

                if (validTypes.includes(file.type)) {
                    // Update the file input with the dropped file
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;

                    showFilePreview(file);
                } else {
                    showError('Invalid file type. Please upload PDF or TXT.');
                }
            }
        }
    }

    function setupFileInput(fileInput, dropZone) {
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                showFilePreview(files[0]);
            }
        });
    }

    function showFilePreview(file) {
        dropZone.innerHTML = `
            <div class="file-preview">
                <span class="file-icon">📄</span>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
        `;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    function setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (document.querySelector('.hero-content')) {
                document.querySelector('.hero-content').style.transform =
                    `translateY(${scrolled * 0.3}px)`;
            }
        });
    }
});