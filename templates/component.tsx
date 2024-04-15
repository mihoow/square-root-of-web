import { component } from "~/utils/component";

type ComponentNameProps = {};

export const ComponentName = component<ComponentNameProps>('ComponentName', function({ className }) {
    return (
        <div className={this.mcn(className)}>
            Hello
        </div>
    )
});
