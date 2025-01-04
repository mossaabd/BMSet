const features = [
    {
        id: 1,
        title: "Smart Notifications",
        description: "Get instant updates about what matters most to you with our intelligent notification system.",
        videoUrlMobile: "https://www.w3schools.com/tags/mov_bbb.mp4",
        videoUrlDesktop: "https://www.w3schools.com/tags/mov_bbb.mp4"
    },
    {
        id: 2,
        title: "Quick Actions",
        description: "Complete tasks in seconds with our intuitive quick action interface.",
        videoUrlMobile: "https://www.w3schools.com/tags/mov_bbb.mp4",
        videoUrlDesktop: "https://www.w3schools.com/tags/mov_bbb.mp4"
    },
    {
        id: 3,
        title: "Seamless Sync",
        description: "Your data is always up to date across all your devices with real-time synchronization.",
        videoUrlMobile: "https://www.w3schools.com/tags/mov_bbb.mp4",
        videoUrlDesktop: "https://www.w3schools.com/tags/mov_bbb.mp4"
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
            // Force video to be visible
            videos[0].style.opacity = '1';
            videos[0].style.visibility = 'visible';

            // Try to play the video
            const playAttempt = setInterval(() => {
                videos[0].play()
                    .then(() => {
                        clearInterval(playAttempt);
                        this.startProgress();
                    })
                    .catch(error => {
                        console.log("Video play attempt failed:", error);
                    });
            }, 1000);

            // Clear interval after 5 attempts
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
            mobileVideo.addEventListener('ended', () => this.handleVideoComplete());
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
            desktopVideo.addEventListener('ended', () => this.handleVideoComplete());
            desktopContainer.appendChild(desktopVideo);
        });

        this.updateVideoContainers();
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

        // Pause and hide current video
        if (videos[this.activeIndex]) {
            videos[this.activeIndex].style.opacity = '0';
            videos[this.activeIndex].style.visibility = 'hidden';
            videos[this.activeIndex].pause();
        }
        buttons[this.activeIndex].classList.remove('active');
        progressBars[this.activeIndex].classList.add('hidden');
        progressBars[this.activeIndex].classList.remove('visible');

        this.activeIndex = index;
        this.progress = 0;

        // Play and show new video
        if (videos[index]) {
            videos[index].style.opacity = '1';
            videos[index].style.visibility = 'visible';
            videos[index].currentTime = 0;
            const playPromise = videos[index].play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Video play error:", error);
                    // Try playing again after a short delay
                    setTimeout(() => {
                        videos[index].play().catch(e => console.log("Retry failed:", e));
                    }, 100);
                });
            }
        }
        buttons[index].classList.add('active');
        progressBars[index].classList.remove('hidden');
        progressBars[index].classList.add('visible');

        this.updateContent();
    }

    startProgress() {
        this.interval = setInterval(() => {
            this.progress += 0.01;
            const progressBar = document.querySelector('.progress.visible');
            if (progressBar) {
                progressBar.style.width = `${this.progress * 100}%`;
            }

            if (this.progress >= 1) {
                this.setActiveIndex((this.activeIndex + 1) % features.length);
                this.progress = 0;
            }
        }, 50);
    }

    handleVideoComplete() {
        this.setActiveIndex((this.activeIndex + 1) % features.length);
        this.progress = 0;
    }
}

// Initialize the showcase when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeatureShowcase();
});