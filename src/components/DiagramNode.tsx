import { Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../App.css';
import { FunctionComponent } from 'react';

export type DiagramNodeProps = {
    data: { label: string },
}


export const DiagramNode: FunctionComponent<DiagramNodeProps> = ({ data }) => {
    return (
        <div style={{width: '20px', height: '20px', border: 'solid', borderRadius:'5px', backgroundColor: '#04AA6D'}}>
            <Handle type="target" position={Position.Top} style={{left: 10}}/>
                <label htmlFor="text" color='black'>{data.label}</label>
            <Handle type="source" position={Position.Bottom} style={{ left: 10 }} />
        </div>);
}