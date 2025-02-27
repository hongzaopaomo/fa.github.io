// 侧边菜单交互
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.side-menu__close');
const sideMenu = document.querySelector('.side-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.side-menu__link');

// 打开菜单
menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
});

// 关闭菜单
const closeMenu = () => {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
};

closeBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// 点击链接后关闭菜单
menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// 按ESC键关闭菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        closeMenu();
    }
});

// 当前section指示器逻辑
const sectionIndicator = document.querySelector('.current-section-indicator');
const sectionIndicatorText = document.querySelector('.current-section-indicator__text');
const sections = document.querySelectorAll('section[id]');
let lastScrollTop = 0;
let isIndicatorVisible = false;

// 检测滚动方向和当前section
const handleScroll = () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingDown = currentScrollTop > lastScrollTop;
    
    // 在移动端才显示指示器
    if (window.innerWidth <= 768) {
        // 控制指示器显示/隐藏
        if (scrollingDown && !isIndicatorVisible && currentScrollTop > 100) {
            sectionIndicator.classList.add('visible');
            isIndicatorVisible = true;
        } else if (!scrollingDown && isIndicatorVisible && currentScrollTop < 100) {
            sectionIndicator.classList.remove('visible');
            isIndicatorVisible = false;
        }

        // 获取当前可见的section
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (currentScrollTop >= sectionTop && currentScrollTop < sectionTop + sectionHeight) {
                currentSection = section.id;
                // 更新指示器文本
                const sectionTitle = section.querySelector('.section-title')?.textContent || '';
                if (sectionTitle) {
                    sectionIndicatorText.textContent = sectionTitle;
                }
            }
        });
    }
    
    lastScrollTop = currentScrollTop;
};

// 添加滚动监听
window.addEventListener('scroll', handleScroll, { passive: true });

// 添加调整窗口大小监听
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sectionIndicator.classList.remove('visible');
        isIndicatorVisible = false;
    }
});

// 返回顶部按钮逻辑
const backToTopButton = document.getElementById('backToTop');
let lastScrollPosition = 0;

// 控制返回顶部按钮的显示/隐藏
const handleBackToTop = () => {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // 当滚动超过视口高度的 20% 时显示按钮
    if (currentScrollPosition > window.innerHeight * 0.2) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
    
    lastScrollPosition = currentScrollPosition;
};

// 点击返回顶部
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 添加滚动监听
window.addEventListener('scroll', handleBackToTop, { passive: true });

// Contact Modal Functionality
const contactModal = document.getElementById('contactModal');
const contactBtn = document.querySelector('.hero__buttons .btn-primary');
const closeModalBtn = document.querySelector('.contact-modal__close');
const copyBtn = document.querySelector('.contact-modal__copy-btn');

// Open modal
contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.classList.add('active');
    document.body.classList.add('no-scroll');
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    contactModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

// Close modal when clicking outside
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Copy email to clipboard
copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email;
    try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'var(--color-primary)';
        copyBtn.style.color = 'var(--color-white)';
        copyBtn.style.borderColor = 'var(--color-primary)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
});

// Prevent scrolling when modal is open
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        contactModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});
