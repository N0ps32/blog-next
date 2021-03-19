import {Component, KeyboardEvent} from 'react';
import {Key} from 'ts-key-enum';

interface ButtonProps {
    onInteract: () => any;
}

export class Button extends Component<ButtonProps> {

    constructor(props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    private onKeyDown(ev: KeyboardEvent<HTMLElement>) {
        if (ev.key === Key.Enter) {
            this.onClick();
        }
    }

    private onClick() {
        if (typeof this.props.onInteract === 'function') {
            this.props.onInteract();
        }
    }

    render() {
        let {children} = this.props;
        return (
            <div tabIndex={0}
                 role="button"
                 onKeyDown={this.onKeyDown}
                 onClick={this.onClick}
                 className="button"
            >
                {children}
            </div>
        );
    }
}
