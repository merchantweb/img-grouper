# ImageGrouper.js

ImageGrouper.js is a lightweight, customizable JavaScript library designed to group images based on blank delimiter images. It offers flexible configuration and supports file organization either in folders or with a custom naming scheme.

## Features

- **Robust Blank Image Detection**: Uses advanced color sampling and thresholding to identify blank delimiter images
- **Flexible Naming**: Group images using a customizable naming convention
- **Folder Support**: Optionally group images into separate folders
- **Folder Scanning**: Automatically read all image files from a specified directory
- **Pluggable and Developer-Friendly**: Easy to integrate into any project

## Installation

Include the library in your project:

```bash
npm install image-grouper
```

Or include the script directly:

```html
<script src="ImageGrouper.js"></script>
```

## Usage

### Basic Example

```javascript
const ImageGrouper = require('image-grouper');

// Configuration
const config = {
    delimiterColor: '#FFFFFF', // Delimiter color (e.g., white)
    colorThreshold: 10,        // Tolerance for color matching
    groupFolder: true,         // Group images into folders
    namingScheme: 'group'      // Base name for groups
};

const grouper = new ImageGrouper(config);

// List of image files
const images = [
    'image1.jpg',
    'blank.jpg',
    'image2.jpg',
    'image3.jpg',
    'blank.jpg',
    'image4.jpg'
];

// Group images
const groupedImages = grouper.groupImages(images);
console.log(groupedImages);
```

### Folder Scanning Example

The library can automatically scan a directory for image files:

```javascript
const folderPath = './images'; // Path to the folder containing images
const groupedImages = grouper.groupImagesFromFolder(folderPath);
console.log(groupedImages);
```

This method reads all image files in the specified folder and groups them according to the configuration.

### Custom Configuration

The library allows you to override its default settings by passing a custom configuration object. For example:

```javascript
const customConfig = {
    delimiterColor: '#FF0000', // Use red as the delimiter color
    colorThreshold: 20,       // Increase the tolerance for color matching
    groupFolder: false,       // Do not create separate folders for groups
    namingScheme: 'customGroup' // Use a custom base name for groups
};

const customGrouper = new ImageGrouper(customConfig);
```

This feature uses the spread operator (`...config`) to merge user-provided settings with the default configuration.

### Configuration Options

| Option           | Type    | Default     | Description                                   |
|------------------|---------|-------------|-----------------------------------------------|
| `delimiterColor` | String  | `#FFFFFF`   | Hex color of the delimiter image.            |
| `colorThreshold` | Number  | `10`        | Tolerance for color difference (0-255).      |
| `groupFolder`    | Boolean | `true`      | Whether to save groups in separate folders.  |
| `namingScheme`   | String  | `group`     | Base name for group folders and images.      |

## Methods

### `groupImages(images)`

Groups the provided images based on the configured delimiter settings.

- **`images`**: Array of image file paths or objects.

Returns an array of grouped images with their new names.

### `groupImagesFromFolder(folderPath)`

Scans the specified folder for image files and groups them based on the configured delimiter settings.

- **`folderPath`**: Path to the folder containing images.

Returns an array of grouped images with their new names.

### `isBlankImage(image, blankColor, threshold)`

Checks if a given image matches the configured blank color using multiple sample points.

- **`image`**: Image file or object
- **`blankColor`**: Hex color to compare against (default: '#FFFFFF')
- **`threshold`**: Maximum allowed color difference (default: 10)

Returns `true` if image is considered blank, `false` otherwise.

### `saveGroups(groups)`

Saves grouped images using the configured naming convention and folder options.

## License

This project is licensed under the MIT License.
