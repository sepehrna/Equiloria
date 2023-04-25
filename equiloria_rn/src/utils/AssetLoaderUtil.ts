export const loadAssetsAsync = async () => {

    const imageAssets = [
        require('../../../assets/user-image-with-black-background.png'), // Add more assets as needed
    ];
    const cacheImages = (images: (string)[]) => {
        return images.map(image => {
            // return Image.prefetch(image);
        });
    };

    await Promise.all(cacheImages(imageAssets));
};
