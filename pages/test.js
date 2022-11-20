import Text from '../components/Inputs/Text.js';
import Select from '../components/Inputs/Select.js';

export default function Test () {
    return (
        <>
            <Text 
                margin="50px"
                name="Name"
                description="Description"
                help="Help"
                placeholder="Placeholder" />
            <Select 
                margin="50px"
                name="Name2"
                description="Description2"
                help="Help2"
                placeholder="Placeholder2" />
        </>
    );
}