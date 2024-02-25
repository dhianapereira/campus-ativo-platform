import { styled } from "@campusativo-ui/react";

export const Container = styled('div', {
    display: 'flex',
    flexDirection: 'row',

    '@media (max-width: 768px)': {
        flexDirection: 'column',
    },
})

export const Body = styled('main', {
    flex: '1',
})

export const Content = styled('div', {
    padding: '0 $8',
})