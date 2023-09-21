import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { Message, removeAllMessages, removeMessage } from "@/lib/store/slices/message";
import { FC, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface Props {
    index: number;
    msg: Message;
}

const variants = {
    hidden: { opacity: 0, x: 0, y: -100 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 100 },
}

const { motion } = require("framer-motion");

const MessageDialog: FC<Props> = ({ index, msg }) => {
    const dispatch = useAppDispatch();

    const remove = useCallback(() => {
        dispatch(removeAllMessages({}));
    }, [dispatch]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            remove();
        }, 8000);

        return () => {
            clearTimeout(timeout);
        }
    }, [remove]);

    const title = msg.type.toUpperCase();
    let color = "bg-teal-100 border-teal-500 text-teal-900";
    let iconColor = "text-teal-500";
    if (msg.type === "error") {
        color = "bg-red-100 border-red-500 text-[#C81E1E]";
        iconColor = "text-[#C81E1E]";
    } else if (msg.type === "warning") {
        color = "bg-orange-100 border-orange-500 text-orange-900";
        iconColor = "text-orange-500";
    } else if (msg.type === "info") {
        color = "bg-blue-100 border-blue-500 text-blue-900";
        iconColor = "text-blue-500";
    }

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ type: 'linear' }}
            className={`${color} relative rounded-lg w-[90%] md:w-[434px] mb-4 px-4 py-3 shadow-md mx-auto`} role="alert">
            <div className="flex">
                <div>
                    <div className="inline-flex items-center space-x-2">
                        <svg
                            width="1.3em"
                            height="1.3em"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                        <div className="font-semibold text-base">{title}</div>
                    </div>
                    <div className="text-sm">{msg.message.toString()}</div>
                </div>
                <span onClick={() => remove()} className="absolute transition-all ease-in-out hover:cursor-pointer top-2 right-2 hover:opacity-75">
                    <svg
                        width="1.4em"
                        height="1.4em"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.29279 4.29296C4.48031 4.10549 4.73462 4.00017 4.99979 4.00017C5.26495 4.00017 5.51926 4.10549 5.70679 4.29296L9.99979 8.58596L14.2928 4.29296C14.385 4.19745 14.4954 4.12127 14.6174 4.06886C14.7394 4.01645 14.8706 3.98886 15.0034 3.98771C15.1362 3.98655 15.2678 4.01186 15.3907 4.06214C15.5136 4.11242 15.6253 4.18667 15.7192 4.28056C15.8131 4.37446 15.8873 4.48611 15.9376 4.60901C15.9879 4.7319 16.0132 4.86358 16.012 4.99636C16.0109 5.12914 15.9833 5.26036 15.9309 5.38236C15.8785 5.50437 15.8023 5.61471 15.7068 5.70696L11.4138 9.99996L15.7068 14.293C15.8889 14.4816 15.9897 14.7342 15.9875 14.9964C15.9852 15.2586 15.88 15.5094 15.6946 15.6948C15.5092 15.8802 15.2584 15.9854 14.9962 15.9876C14.734 15.9899 14.4814 15.8891 14.2928 15.707L9.99979 11.414L5.70679 15.707C5.51818 15.8891 5.26558 15.9899 5.00339 15.9876C4.74119 15.9854 4.49038 15.8802 4.30497 15.6948C4.11956 15.5094 4.01439 15.2586 4.01211 14.9964C4.00983 14.7342 4.11063 14.4816 4.29279 14.293L8.58579 9.99996L4.29279 5.70696C4.10532 5.51943 4 5.26512 4 4.99996C4 4.73479 4.10532 4.48049 4.29279 4.29296Z"
                            fill="currentColor"
                        />
                    </svg>
                </span>
            </div>
        </motion.div>
    )
}

const FlashMessage = () => {
    const { messages } = useAppSelector((state) => state.message);
    const [isBrowser, setIsBrowser] = useState(false)

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const messageContent = messages.length > 0 ? (
        <div className="fixed z-[1000] left-0 right-0 top-28 mx-auto">
            {messages.slice(0, 1).map((msg, i) => <MessageDialog key={i} index={i} msg={msg} />)}
        </div>
    ) : <div />;

    if (isBrowser) {
        return ReactDOM.createPortal(
            messageContent,
            document.getElementById("modal-root") as HTMLElement
        );
    } else {
        return null;
    }
}

export default FlashMessage;