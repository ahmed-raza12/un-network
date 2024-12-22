import colors from './colors';

const TextFieldStyle = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            // borderColor: '#000',
        },
        '&:hover fieldset': {
            borderColor: colors.primary,
        },
        '&.Mui-focused fieldset': {
            borderColor: colors.primary,
        },
    },
    backgroundColor: 'transparent'
};

export { TextFieldStyle };