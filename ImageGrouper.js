// ImageGrouper.js: A library for grouping images based on custom delimiter rules

class ImageGrouper {
    constructor(config = {}) {
        // Default configuration
        this.config = {
            delimiterColor: '#FFFFFF', // Default delimiter color (white)
            colorThreshold: 10,      // Tolerance for color match
            groupFolder: true,       // Whether to use folders for groups
            namingScheme: 'group',   // Base name for groups
            ...config                // Override with user configuration
        };
    }

    // Helper: Calculate color difference
    colorDifference(hex1, hex2) {
        const rgb1 = this.hexToRgb(hex1);
        const rgb2 = this.hexToRgb(hex2);

        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        );
    }

    /**
     * Group images by blank delimiters
     * @param {Array<HTMLImageElement>} images - Array of image elements
     * @param {Object} [options] - Optional configuration
     * @param {string} [options.blankColor='#FFFFFF'] - Hex color to identify delimiters
     * @param {number} [options.threshold=10] - Color difference threshold
     * @param {boolean} [options.saveGroups=false] - Whether to save groups to folders
     * @returns {Array<Array<HTMLImageElement>>|Array<Object>} Grouped images or saved groups
     */
    groupImages(images, options = {}) {
        const config = {
            blankColor: options.blankColor || this.config.delimiterColor,
            threshold: options.threshold || this.config.colorThreshold,
            saveGroups: options.saveGroups || false
        };

        const groups = [];
        let currentGroup = [];
        
        for (const image of images) {
            if (this.isBlankImage(image, config.blankColor, config.threshold)) {
                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                    currentGroup = [];
                }
            } else {
                currentGroup.push(image);
            }
        }
        
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return config.saveGroups ? this.saveGroups(groups) : groups;
    }

    /**
     * Analyze image to determine if it's a blank delimiter
     * @param {HTMLImageElement} image - Image element to analyze
     * @param {string} blankColor - Hex color to compare against
     * @param {number} threshold - Maximum allowed color difference
     * @returns {boolean} True if image is considered blank
     */
    isBlankImage(image, blankColor = '#FFFFFF', threshold = 10) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match image
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        
        // Define sample points (center, quarter points)
        const samplePoints = [
            { x: Math.floor(image.width / 2), y: Math.floor(image.height / 2) },
            { x: Math.floor(image.width / 4), y: Math.floor(image.height / 4) },
            { x: Math.floor((3 * image.width) / 4), y: Math.floor((3 * image.height) / 4) }
        ];
        
        // Convert blankColor to RGB
        const targetRGB = this.hexToRgb(blankColor);
        
        // Calculate total color difference
        let totalDiff = 0;
        for (const point of samplePoints) {
            const pixel = ctx.getImageData(point.x, point.y, 1, 1).data;
            const diff = Math.abs(pixel[0] - targetRGB.r) + 
                        Math.abs(pixel[1] - targetRGB.g) + 
                        Math.abs(pixel[2] - targetRGB.b);
            totalDiff += diff;
        }
        
        // Calculate average difference
        const avgDiff = totalDiff / samplePoints.length;
        return avgDiff <= threshold;
    }

    /**
     * Convert hex color to RGB
     * @param {string} hex - Hex color string
     * @returns {Object} RGB values
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    // Save groups
    saveGroups(groups) {
        let savedGroups = [];

        groups.forEach((group, groupIndex) => {
            const groupName = `${this.config.namingScheme}${groupIndex + 1}`;
            const savedGroup = group.map((image, imageIndex) => {
                return this.saveImage(image, `${groupName}-image${imageIndex + 1}`);
            });

            if (this.config.groupFolder) {
                this.createFolder(groupName);
                this.moveImagesToFolder(savedGroup, groupName);
            }

            savedGroups.push(savedGroup);
        });

        return savedGroups;
    }

    // Save a single image with a new name
    saveImage(image, newName) {
        // Save logic (file system or virtual handling, placeholder)
        return { image, newName };
    }

    // Create folder (if groupFolder is true)
    createFolder(folderName) {
        // File system logic to create folders (placeholder)
    }

    // Move images to folder
    moveImagesToFolder(images, folderName) {
        // File system logic to move images (placeholder)
    }

    // Scan folder for images
    groupImagesFromFolder(folderPath) {
        const fs = require('fs');
        const path = require('path');

        const images = fs.readdirSync(folderPath).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
        });

        const fullPaths = images.map(image => path.join(folderPath, image));
        return this.groupImages(fullPaths);
    }
}

// Export for use in any project
module.exports = ImageGrouper;
