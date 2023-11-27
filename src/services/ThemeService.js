const ThemeService = {
    availableThemes: {
        plain: 'plain', 
        colorful: 'colorful'
    },
    currentTheme: 'default',
    visualize: (theme, canvas, amplitudeArray) => {
        this[theme](canvas, amplitudeArray)
    },
    plain: (canvas, amplitudeArray) => {
        // Draw the amplitude inside the canvas
        const canvasContext = canvas.current.getContext("2d");

        // Clear the canvas
        canvasContext.clearRect(
            0,
            0,
            canvas.current.width,
            canvas.current.height
        );

        // Draw the amplitude inside the canvas
        for (let i = 0; i < amplitudeArray.length; i++) {
            const value = amplitudeArray[i] / 256;
            const y = canvas.current.height - canvas.current.height * value;
            canvasContext.fillStyle = "white";
            canvasContext.fillRect(i*2, y, 2, 2);
        }
    },
    colorful: (canvas, amplitudeArray) => {
        // Draw the amplitude inside the canvas
        const canvasContext = canvas.current.getContext("2d");

        // Clear the canvas
        canvasContext.clearRect(
            0,
            0,
            canvas.current.width,
            canvas.current.height
        );

        // Draw the amplitude inside the canvas
        for (let i = 0; i < amplitudeArray.length; i++) {
            const colors = ['red', 'green', 'blue', 'yellow'];
            const value = amplitudeArray[i] / 256;
            canvasContext.fillStyle = colors[(i/4) % 4];
            canvasContext.fillRect(i*2, canvas.current.height * value, 2, 256 - canvas.current.height * value);
        }
    },
}

export default ThemeService;