const features = [
    {
        id: 1,
        title: "Questions Officiels",
        description: "Accédez rapidement à un vaste répertoire de questions, organisées par année, module et chapitre. Cette structure facilite la navigation et la révision",
        videoUrlMobile: "./videos/feature1-desktop.mp4",
        videoUrlDesktop: "./videos/feature1-desktop.mp4"
    },
    {
        id: 2,
        title: "Bibliothèque Actualisée",
        description: "Notre bibliothèque offre un accès à des cours officiels et actualisés fournis par les professeurs. Les étudiants peuvent suivre leur progression, ce qui les aide à rester organisés ",
        videoUrlMobile: "./videos/feature1-desktop.mp4",
        videoUrlDesktop: "./videos/feature1-desktop.mp4"
    },
    {
        id: 3,
        title: "Explications Détailées",
        description: "La majorité des questions sont accompagnées d'explications détaillées, renforcées par des schémas, des tableaux et des images, qui éclaircissent les concepts clés et offrent des exemples pertinents.",
        videoUrlMobile: "./videos/feature1-desktop.mp4",
        videoUrlDesktop: "./videos/feature1-desktop.mp4"
    }
];

class FeatureShowcase {
    constructor() {
        this.activeIndex = 0;
        this.progress = 0;
        this.interval = null;
        this.isMobile = window.innerWidth < 768;
        this.init();
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    init() {
        this.renderVideos();
        this.renderNavigation();
        this.updateContent();
        this.initializeFirstVideo();
    }

    initializeFirstVideo() {
        const videos = this.getActiveVideos();
        if (videos[0]) {
            videos[0].style.opacity = '1';
            videos[0].style.visibility = 'visible';

            const playAttempt = setInterval(() => {
                videos[0].play()
                    .then(() => {
                        clearInterval(playAttempt);
                    })
                    .catch(error => {
                        console.log("Video play attempt failed:", error);
                    });
            }, 1000);

            setTimeout(() => clearInterval(playAttempt), 5000);
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;

        // Only reload videos if we've crossed the breakpoint
        if (wasMobile !== this.isMobile) {
            this.reloadVideos();
        }
    }

    renderVideos() {
        const mobileContainer = document.getElementById('video-container-mobile');
        const desktopContainer = document.getElementById('video-container-desktop');

        mobileContainer.innerHTML = '';
        desktopContainer.innerHTML = '';

        features.forEach((feature, index) => {
            // Mobile video
            const mobileVideo = document.createElement('video');
            mobileVideo.className = `video ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
            mobileVideo.src = feature.videoUrlMobile;
            mobileVideo.muted = true;
            mobileVideo.playsInline = true;
            mobileVideo.loop = true;
            mobileVideo.autoplay = true;
            mobileVideo.controls = false;
            mobileVideo.preload = 'auto';
            mobileVideo.style.visibility = index === 0 ? 'visible' : 'hidden';
            mobileVideo.addEventListener('timeupdate', () => this.handleTimeUpdate());
            mobileContainer.appendChild(mobileVideo);

            // Desktop video
            const desktopVideo = document.createElement('video');
            desktopVideo.className = `video ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
            desktopVideo.src = feature.videoUrlDesktop;
            desktopVideo.muted = true;
            desktopVideo.playsInline = true;
            desktopVideo.loop = true;
            desktopVideo.autoplay = true;
            desktopVideo.controls = false;
            desktopVideo.preload = 'auto';
            desktopVideo.style.visibility = index === 0 ? 'visible' : 'hidden';
            desktopVideo.addEventListener('timeupdate', () => this.handleTimeUpdate());
            desktopContainer.appendChild(desktopVideo);
        });

        this.updateVideoContainers();
    }

    handleTimeUpdate() {
        const videos = this.getActiveVideos();
        const currentVideo = videos[this.activeIndex];

        if (currentVideo) {
            const progress = currentVideo.currentTime / currentVideo.duration;
            this.updateProgress(progress);

            if (currentVideo.currentTime >= currentVideo.duration - 0.1) {
                this.setActiveIndex((this.activeIndex + 1) % features.length);
            }
        }
    }

    updateProgress(progress) {
        const activeButton = document.querySelector('.nav-button.active');
        const progressBar = activeButton?.querySelector('.progress');

        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }
    }

    updateVideoContainers() {
        const mobileContainer = document.getElementById('video-container-mobile');
        const desktopContainer = document.getElementById('video-container-desktop');

        if (this.isMobile) {
            mobileContainer.style.display = 'block';
            desktopContainer.style.display = 'none';
        } else {
            mobileContainer.style.display = 'none';
            desktopContainer.style.display = 'block';
        }
    }

    reloadVideos() {
        this.updateVideoContainers();
        const videos = this.getActiveVideos();
        videos[this.activeIndex].currentTime = 0;
        videos[this.activeIndex].play();
    }

    getActiveVideos() {
        const container = this.isMobile ? 'video-container-mobile' : 'video-container-desktop';
        return document.querySelectorAll(`#${container} .video`);
    }

    renderNavigation() {
        const nav = document.getElementById('navigation');
        features.forEach((_, index) => {
            const button = document.createElement('button');
            button.className = `nav-button ${index === 0 ? 'active' : ''}`;
            button.onclick = () => this.setActiveIndex(index);

            const progress = document.createElement('div');
            progress.className = `progress ${index === 0 ? 'visible' : 'hidden'}`;
            button.appendChild(progress);

            nav.appendChild(button);
        });
    }

    updateContent() {
        const container = document.getElementById('feature-text');
        const feature = features[this.activeIndex];
        container.innerHTML = `
            <h3 class="text-2xl font-bold">${feature.title}</h3>
            <p class="text-gray-600 mt-4">${feature.description}</p>
        `;
    }

    setActiveIndex(index) {
        const videos = this.getActiveVideos();
        const buttons = document.querySelectorAll('.nav-button');
        const progressBars = document.querySelectorAll('.progress');

        if (!videos.length) return;

        // Reset progress on previous button
        if (progressBars[this.activeIndex]) {
            progressBars[this.activeIndex].style.width = '0%';
        }
        buttons[this.activeIndex].classList.remove('active');

        // Pause and hide current video
        if (videos[this.activeIndex]) {
            videos[this.activeIndex].style.opacity = '0';
            videos[this.activeIndex].style.visibility = 'hidden';
            videos[this.activeIndex].pause();
        }

        this.activeIndex = index;

        // Play and show new video
        if (videos[index]) {
            videos[index].style.opacity = '1';
            videos[index].style.visibility = 'visible';
            videos[index].currentTime = 0;
            const playPromise = videos[index].play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Video play error:", error);
                    setTimeout(() => {
                        videos[index].play().catch(e => console.log("Retry failed:", e));
                    }, 100);
                });
            }
        }
        buttons[index].classList.add('active');

        this.updateContent();
    }
}

function updateActiveButton(index) {
    const buttons = document.querySelectorAll('.nav-button');
    const progress = document.querySelector('.progress');

    buttons.forEach((button, i) => {
        button.classList.toggle('active', i === index);
    });

    // Update progress bar position
    progress.setAttribute('data-state', index + 1);
}

// Initialize the showcase when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeatureShowcase();
});