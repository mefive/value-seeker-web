import { css } from 'styled-components';

export const palette = color => css`${props => props.theme.palette[color] || color}`;

export const spacing = value => css`${props => props.theme.spacing(value)}`;

export const bold = css`
  font-family: ${props => `"PingFangSC-Medium", ${props.theme.fontFamily}`};
`;

export const scrollBar = css`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d0d0d7;
  }
  &::-webkit-scrollbar-track {
    background: #f4f4f8;
  }
`;

export const m = space => css`margin: ${spacing(space)}px;`;
export const mt = space => css`margin-top: ${spacing(space)}px;`;
export const ml = space => css`margin-left: ${spacing(space)}px;`;
export const mb = space => css`margin-bottom: ${spacing(space)}px;`;
export const mr = space => css`margin-right: ${spacing(space)}px;`;
export const mx = space => css`margin-left: ${spacing(space)}px;margin-right: ${spacing(space)}px;`;
export const my = space => css`margin-top: ${spacing(space)}px;margin-bottom: ${spacing(space)}px;`;

export const p = space => css`padding: ${spacing(space)}px;`;
export const pt = space => css`padding-top: ${spacing(space)}px;`;
export const pl = space => css`padding-left: ${spacing(space)}px;`;
export const pb = space => css`padding-bottom: ${spacing(space)}px;`;
export const pr = space => css`padding-right: ${spacing(space)}px;`;
export const px = space => css`padding-left: ${spacing(space)}px;padding-right: ${spacing(space)}px;`;
export const py = space => css`padding-top: ${spacing(space)}px;padding-bottom: ${spacing(space)}px;`;
