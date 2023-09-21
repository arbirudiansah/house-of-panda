
import { useAppSelector } from "@/lib/store/hooks";
import { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const dropIn = {
	hidden: {
		y: "-50px",
		opacity: 0,
	},
	visible: {
		y: "0",
		opacity: 1,
		transition: {
			duration: 0.9,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
	exit: {
		y: "-50px",
		opacity: 0,
	},
}

const Modal: FC = () => {
	const { show, component } = useAppSelector(state => state.modal)
	const [isBrowser, setIsBrowser] = useState(false)

	useEffect(() => {
		setIsBrowser(true);
	}, []);

	const modalContent = show && (
		<motion.div
			className="modal-overlay"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			key="modal"
		>
			<motion.div
				variants={dropIn}
				initial="hidden"
				animate="visible"
				exit="exit"
				style={{
					width: "500px",
					height: "auto",
				}}
				key="modal-content"
			>
				<StyledModalBody>{component}</StyledModalBody>
			</motion.div>
		</motion.div>
	);

	if (isBrowser) {
		return ReactDOM.createPortal(
			<AnimatePresence>{modalContent}</AnimatePresence>,
			document.getElementById("modal-root") as HTMLElement
		);
	} else {
		return null;
	}
}

const StyledModalBody = styled.div`
  padding-top: 10px;
  z-index: 900;
`;


export default Modal;

