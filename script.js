/* ==========================================================================
   ثلاثاء الوفاء للشهداء (6 أيلول 2011)
   JavaScript التفاعلي — Spotlight Cursor, Lightbox & Web3Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. Spotlight Cursor Follow
    // --------------------------------------------------------------------------
    const spotlight = document.getElementById('cursor-spotlight');

    if (spotlight && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            spotlight.style.opacity = '1';
            spotlight.style.left = `${e.clientX}px`;
            spotlight.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseleave', () => {
            spotlight.style.opacity = '0';
        });
    }

    // --------------------------------------------------------------------------
    // 2. Scroll Reveal Animations (IntersectionObserver)
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --------------------------------------------------------------------------
    // 3. Cinematic Lightbox Modal
    // --------------------------------------------------------------------------
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const visualWraps = document.querySelectorAll('.scene-visual-wrap');

    function openLightbox(src, caption, alt) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || caption;
        if (lightboxCaption) {
            lightboxCaption.textContent = caption;
        }
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) {
            lightboxImg.src = '';
        }
    }

    visualWraps.forEach(wrap => {
        wrap.addEventListener('click', () => {
            const imgSrc = wrap.getAttribute('data-img');
            const caption = wrap.getAttribute('data-caption') || '';
            const imgEl = wrap.querySelector('img');
            const alt = imgEl ? imgEl.getAttribute('alt') : '';
            openLightbox(imgSrc, caption, alt);
        });
    });

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --------------------------------------------------------------------------
    // 4. Web3Forms Real Integration (Zero Sim / Strict Mandate)
    // --------------------------------------------------------------------------
    const pledgeForm = document.getElementById('pledge-web-form');
    const submitBtn = document.getElementById('pledge-submit-btn');
    const feedbackMsg = document.getElementById('form-feedback-msg');

    if (pledgeForm) {
        pledgeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Client-side validation
            const name = document.getElementById('pledge-name')?.value.trim();
            const city = document.getElementById('pledge-city')?.value.trim();
            const message = document.getElementById('pledge-message')?.value.trim();

            if (!name || !city || !message) {
                showFeedback('يرجى ملء كافة الحقول الأساسية (الاسم، المدينة، والرسالة) لتسجيل العهد.', 'error');
                return;
            }

            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
                    <span>جاري التوثيق والإرسال...</span>
                `;
            }

            hideFeedback();

            try {
                const formData = new FormData(pledgeForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showFeedback('تم تسجيل وتوثيق عهدك بنجاح في السجل الوطني لشهداء ثلاثاء الوفاء. عاشت سوريا حرة أبية وذات سيادة.', 'success');
                    pledgeForm.reset();
                } else {
                    const errDetail = data.message || 'حدث خطأ أثناء محاولة التوثيق، يرجى إعادة المحاولة.';
                    showFeedback(errDetail, 'error');
                }
            } catch (err) {
                console.error('Submission error:', err);
                showFeedback('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `
                        <span>إرسال وتوثيق العهد</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    `;
                }
            }
        });
    }

    function showFeedback(text, type) {
        if (!feedbackMsg) return;
        feedbackMsg.textContent = text;
        feedbackMsg.className = `form-feedback ${type}`;
        feedbackMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideFeedback() {
        if (!feedbackMsg) return;
        feedbackMsg.className = 'form-feedback';
        feedbackMsg.textContent = '';
    }

});
