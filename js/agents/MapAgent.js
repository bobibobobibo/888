class MapAgent {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.init();
        this.bindEvents();
    }

    async init() {
        // 等待 Google Maps API 載入
        await this.loadGoogleMapsAPI();
        this.initializeMap();
    }

    loadGoogleMapsAPI() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initializeMap() {
        const mapOptions = {
            center: { lat: 25.0174, lng: 121.5405 }, // 預設中心點（台大）
            zoom: 13,
            styles: this.getMapStyles()
        };

        this.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
        
        // 添加學校標記
        CONFIG.UNIVERSITIES.forEach(university => {
            this.addMarker(university);
        });
    }

    bindEvents() {
        document.addEventListener('checkIn', this.handleCheckIn.bind(this));
        document.addEventListener('dataUpdate', this.updateMarkers.bind(this));
    }

    handleCheckIn(event) {
        const checkInData = event.detail;
        const university = CONFIG.UNIVERSITIES.find(u => u.id === checkInData.university);
        if (university) {
            event.detail.location = university.location;
            this.highlightLocation(university.location);
        }
    }

    addMarker(university) {
        const marker = new google.maps.Marker({
            position: university.location,
            map: this.map,
            title: university.name
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${university.name}</h3><p>點擊查看詳情</p>`
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });

        this.markers.set(university.id, marker);
    }

    highlightLocation(location) {
        this.map.setCenter(location);
        this.map.setZoom(15);
    }

    updateMarkers(event) {
        // 可以根據簽到數據更新地圖標記
    }

    getMapStyles() {
        // 可以根據深色模式返回不同的地圖樣式
        return [];
    }
}
