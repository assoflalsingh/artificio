import React, { forwardRef, useMemo } from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function ButtonLink({children, to, ...props}) {
  const CustomLink = useMemo(
    () =>
        forwardRef((linkProps, ref) => (
            <Link ref={ref} to={to} {...linkProps} />
        )),
    [to],
  );

  return (
    <Button component={CustomLink} {...props}>{children}</Button>
  );
}