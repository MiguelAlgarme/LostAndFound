import React, { Children } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";

//BTW IN THE FontAwesomeIcon tag you can add an effect on the icon HOORAHHHHHH!!!

export default function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title text-">
        <b>WANDERLOST</b>
      </Link>
      <ul>
        <CustomLink to="/Home">
          <FontAwesomeIcon icon={faHouse} size="xl" />
        </CustomLink>

        <CustomLink to="/Profile">
          <FontAwesomeIcon icon={faUser} size="xl" />
        </CustomLink>

        <CustomLink to="/Form">
          <b>Form</b>
        </CustomLink>

        <CustomLink to="/About">
          <b>About</b>
        </CustomLink>
      </ul>
    </nav>
  );
}

//TL;DR, click on page then it gets activated, remove "end:true" if you want it to still active if inside the page.
interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
}

function CustomLink({ to, children, ...props }: CustomLinkProps) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
