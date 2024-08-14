import { ImageSourcePropType } from "react-native"; // Correct import

export type ImageSlideType = {
  // Rename custom type to avoid conflict
  title: string; // Use lowercase 'string' instead of 'String'
  image: ImageSourcePropType;
  description: string; // Use lowercase 'string' instead of 'String'
};

const ImageSlider = [
  {
    title: "Your Title 1",
    image: require("../assets/images/main_img.png"),
    description: "Welcome to our app! We're glad to have you with us.",
  },
  {
    title: "Your Title 2",
    image: require("../assets/images/download.png"),
    description: "Your description goes here.",
  },
  {
    title: "Your Title 3",
    image: require("../assets/images/main_img.png"),
    description: "Your description goes here.",
  },
  {
    title: "Your Title 4",
    image: require("../assets/images/download.png"),
    description: "Welcome to our app! We're glad to have you with us.",
  },
  {
    title: "Your Title 5",
    image: require("../assets/images/main_img.png"),
    description: "Your description goes here.",
  },
];

export default ImageSlider;
