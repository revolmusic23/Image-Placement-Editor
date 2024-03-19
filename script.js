new Vue({
    el: '#app',
    data: {
        canvasWidth: 1920,
        canvasHeight: 1080,
        imageScale: 100,
        imagePlacement: '',
        selectedImage: null,
        canvas: null,
        ctx: null
    },
    mounted() {
        this.initCanvas();
        this.updateCanvasSize();
    },
    methods: {
        initCanvas() {
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.updateCanvasSize();
        },
        updateCanvasSize() {
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            
            const canvasElement = document.getElementById('canvas');
            canvasElement.style.width = `${(this.canvasWidth / 1920) * 64 }vw`;
            canvasElement.style.height = `${(this.canvasHeight / 1080) * 36 }vw`;
            
            this.draw();
        },
        onImageSelect(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const img = new Image();
                    img.onload = () => {
                        this.selectedImage = img;
                        this.draw();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        setImagePlacement(position) {
            this.imagePlacement = position;
            this.draw();
        },
        draw() {
            if (!this.ctx || !this.selectedImage) return;
        
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
            const scaleX = this.canvas.width / this.selectedImage.width;
            const scaleY = this.canvas.height / this.selectedImage.height;
            const scale = Math.min(scaleX, scaleY);
        
            const imgWidth = this.selectedImage.width * scale * (this.imageScale/100);
            const imgHeight = this.selectedImage.height * scale * (this.imageScale/100);

            let x = (this.canvas.width - imgWidth) / 2;
            let y = (this.canvas.height - imgHeight) / 2;

            switch (this.imagePlacement) {
                case 'top':
                    y = 0;
                    break;
                case 'bottom':
                    y = this.canvas.height - imgHeight;
                    break;
                case 'left':
                    x = 0;
                    break;
                case 'right':
                    x = this.canvas.width - imgWidth;
                    break;
            }
            
            this.ctx.drawImage(this.selectedImage, x, y, imgWidth, imgHeight);
        },
        downloadImage() {
            const image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const link = document.createElement('a');
            link.download = 'image-placement-editor.png';
            link.href = image;
            link.click();
        },
    },
    watch: {
        canvasWidth(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateCanvasSize();
            }
        },
        canvasHeight(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateCanvasSize();
            }
        },
        imageScale(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.draw();
            }
        }
    }
});
