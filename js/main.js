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

// 更新 hero section 中的 Contact Us 按钮链接
document.querySelector('.hero__buttons .btn-primary').setAttribute('href', '#contact');

// 处理Projects下拉菜单
const projectsDropdownLink = document.querySelector('.nav-links__link.has-dropdown');
if (projectsDropdownLink) {
    projectsDropdownLink.addEventListener('click', (e) => {
        // 阻止默认行为，不进行页面跳转
        e.preventDefault();
        // 点击时下拉菜单会通过CSS的hover效果显示
    });
}

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
    
    // 导航栏滚动效果
    const navLinks = document.querySelector('.nav-links-section');
    if (currentScrollTop > 50) {
        navLinks.classList.add('scrolled');
    } else {
        navLinks.classList.remove('scrolled');
    }
    
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
    
    // 当滚动超过300px时显示按钮
    if (currentScrollPosition > 300) {
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

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // 如果是Projects下拉菜单链接，不阻止默认行为（前面已单独处理）
        if (this.classList.contains('has-dropdown')) {
            return;
        }
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#contact') {
            // 显示联系我们弹窗
            if (contactModal) contactModal.style.display = 'flex';
            return;
        }
        
        // 特殊处理各个链接的跳转
        let targetElement = null;
        let titleText = '';
        
        if (targetId === '#about-section') {
            // 查找About标题
            titleText = 'about us';
            const sectionTitles = document.querySelectorAll('.section-title');
            for (const title of sectionTitles) {
                if (title.textContent.trim().toLowerCase() === titleText) {
                    targetElement = title.closest('.section-header');
                    break;
                }
            }
        } else if (targetId === '#foundation-numbers-section') {
            // 查找Foundation Numbers标题
            titleText = 'Foundation Numbers';
            const sectionTitles = document.querySelectorAll('.section-title');
            for (const title of sectionTitles) {
                if (title.textContent.trim() === titleText) {
                    targetElement = title.closest('.section-header');
                    break;
                }
            }
        } else if (targetId === '#agritech-section') {
            // 查找Agriculture Tech标题
            titleText = 'Projects: Agriculture Tech';
            const sectionTitles = document.querySelectorAll('.section-title');
            for (const title of sectionTitles) {
                if (title.textContent.trim() === titleText) {
                    targetElement = title.closest('.section-header');
                    break;
                }
            }
        } else if (targetId === '#agriedu-section') {
            // 查找Agriculture Edu标题
            titleText = 'Projects: Agricultural Edu';
            const sectionTitles = document.querySelectorAll('.section-title');
            for (const title of sectionTitles) {
                if (title.textContent.trim() === titleText) {
                    targetElement = title.closest('.section-header');
                    break;
                }
            }
        } else {
            // 其他链接正常处理
            targetElement = document.querySelector(targetId);
        }
        
        if (targetElement) {
            // 关闭移动端菜单（如果打开）
            if (sideMenu && sideMenu.classList.contains('active')) {
                sideMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                if (menuOverlay) menuOverlay.classList.remove('active');
            }
            
            // 获取目标元素位置
            const headerOffset = 80; // 导航栏高度 + 一些额外空间
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            // 滚动到目标位置
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // 更新当前section指示器
            if (sectionIndicator) {
                let sectionName = '';
                if (targetId === '#about-section') sectionName = 'About Us';
                else if (targetId === '#focus-areas') sectionName = 'Projects';
                else if (targetId === '#agritech-section') sectionName = 'Agriculture Tech';
                else if (targetId === '#agriedu-section') sectionName = 'Agriculture Edu';
                else if (targetId === '#foundation-numbers-section') sectionName = 'Our Foundation Numbers';
                
                if (sectionName) {
                    if (sectionIndicatorText) sectionIndicatorText.textContent = sectionName;
                    sectionIndicator.classList.add('visible');
                    
                    // 5秒后隐藏
                    setTimeout(() => {
                        sectionIndicator.classList.remove('visible');
                    }, 5000);
                }
            }
        }
    });
});

// Foundation Numbers Cards Interaction
function initFoundationNumbersCards() {
    const cards = document.querySelectorAll('.numbers-card');
    let activeCard = null;

    // 检测是否为移动设备
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
        // 为每个卡片添加点击事件
        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                // 如果当前卡片已经是激活状态，则取消激活
                if (this === activeCard) {
                    this.classList.remove('active');
                    activeCard = null;
                    return;
                }

                // 移除其他卡片的激活状态
                if (activeCard) {
                    activeCard.classList.remove('active');
                }

                // 激活当前卡片
                this.classList.add('active');
                activeCard = this;
            });
        });

        // 点击页面其他地方时取消卡片激活状态
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.numbers-card') && activeCard) {
                activeCard.classList.remove('active');
                activeCard = null;
            }
        });
    }
}

// 初始化所有功能
function initializeAll() {
    initFoundationNumbersCards();
    // 其他可能的初始化函数调用可以放在这里
}

// 当 DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeAll);
