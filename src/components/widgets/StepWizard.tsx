import classNames from "classnames";
import React from "react";
import { Children, ReactNode } from "react";

interface Props {
    children: ReactNode;
    totalStep: number;
}

interface StepState {
    currentStep: number;
    totalStep: number;
}

type Action = { type: 'next' | 'prev' }
type Dispatch = (action: Action) => void
type State = {
    state: StepState;
    dispatch: Dispatch;
    next: () => void;
    prev: () => void;
}

export const StepWizardContext = React.createContext<State | undefined>(undefined);

function stepReducer(state: StepState, action: Action) {
    switch (action.type) {
        case 'next': {
            if (state.currentStep < state.totalStep) {
                return { currentStep: state.currentStep + 1, totalStep: state.totalStep }
            }

            return state
        }
        case 'prev': {
            if (state.currentStep === 1) {
                return state
            }

            return { currentStep: state.currentStep - 1, totalStep: state.totalStep }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

function StepWizardProvider({ children, totalStep }: Props) {
    const [state, dispatch] = React.useReducer(stepReducer, { currentStep: 1, totalStep })
    const value: State = {
        state,
        dispatch,
        next: () => dispatch({ type: 'next' }),
        prev: () => dispatch({ type: 'prev' }),
    }

    return (
        <StepWizardContext.Provider value={value}>
            {children}
        </StepWizardContext.Provider>
    )
}

export function useStepWizard() {
    const context = React.useContext(StepWizardContext)
    if (context === undefined) {
        throw new Error('useStepWizard must be used within a StepWizardProvider')
    }

    return context
}

const StepWizardWidget = ({ children }: { children: ReactNode }) => {
    const { state: { currentStep, totalStep } } = useStepWizard();
    const childs = Children.toArray(children);

    return (
        <div className="w-full">
            <div className="inline-flex items-center relative w-full overflow-hidden mb-10">
                {Array.apply(null, Array(totalStep)).map((_, i) => {
                    const step = i + 1;
                    const active = step === currentStep;
                    const pass = step < currentStep;
                    const classes = classNames(
                        "w-12 h-12 mb-3 border-2 rounded-full justify-center flex items-center relative",
                        {
                            ["bg-[#F4F7FF] border-primary text-primary"]: active && !pass,
                            ["bg-[#F4F7FF] border-outer text-slate-800"]: !active && !pass,
                            ["bg-primary text-white border-primary"]: pass,
                        }
                    )

                    return (
                        <div key={i} className={classNames(`w-1/3 relative flex`, {
                            ["justify-center"]: step > 1 && step < totalStep,
                            ["justify-end"]: step === totalStep,
                        })}>
                            <div className={classNames("w-full bg-gray-200 absolute top-6", {
                                ["ml-3"]: step === 1,
                                ["mr-3"]: step === totalStep,
                            })}>
                                <div className={classNames("h-[2px] w-full", {
                                    ["bg-outer"]: !pass && !active,
                                    ["bg-primary"]: pass,
                                    ["hybrid-line"]: active && step === 2,
                                    ["bg-primary block"]: active && step === totalStep,
                                })} />
                            </div>
                            <div className={classNames(`flex w-16 flex-col justify-center items-center`)}>
                                <div className={classes}>
                                    <p className="text-xl font-medium leading-none text-current">{step}</p>
                                </div>
                                <div className="text-base font-medium">Step {step}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {Children.map(childs, (child, index) => {
                if (index === currentStep - 1) return child
            })}
        </div>
    );
}

const StepWizard = ({ children }: { children: ReactNode }) => {
    const count = Children.count(children)

    return (
        <StepWizardProvider totalStep={count}>
            <StepWizardWidget>
                {children}
            </StepWizardWidget>
        </StepWizardProvider>
    )
}

export default StepWizard;