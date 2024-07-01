import React from 'react';
import { Svg, Path } from 'react-native-svg';

const ListBoxIcon = () => {
    return (
        <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4ZM20 6H4V18H20V6ZM6 9H18V11H6V9ZM6 13H18V15H6V13ZM6 17H18V19H6V17Z"
                fill="black"
            />
        </Svg>
    );
};

export default ListBoxIcon;
