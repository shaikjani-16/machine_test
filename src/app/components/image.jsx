import { Image } from "cloudinary-react";

export default function ShowImage({ imageid }) {
  const imageurl = `https://res.cloudinary.com/dnnjgmqo0/image/upload/c_limit,f_auto,h_400,q_auto,w_400/v1/${imageid}`;

  return (
    <div>
      <div className="gallery">
        {/* Corrected the publicId and used imageurl for image */}
        <Image
          key="1"
          cloudName="dnnjgmqo0"
          publicId={imageid} // Use imageid directly here
          width="30"
          crop="scale"
        />
        {/* You can also use the imageurl in case you want to directly display the image */}
        {/* <img src={imageurl} alt="Employee" /> */}
      </div>
    </div>
  );
}
