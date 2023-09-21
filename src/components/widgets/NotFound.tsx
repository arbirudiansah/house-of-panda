import Lottie from 'react-lottie';
import * as NotFoundAnimation from '@/components/assets/json/NotFoundAnimation.json';

const NotFound = () => {
    return (
        <div>
            <Lottie
                isClickToPauseDisabled
                ariaRole="div"
                width={"40%"}
                options={{
                    loop: false,
                    autoplay: true,
                    animationData: NotFoundAnimation,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }} />
        </div>
    );
}

export default NotFound;