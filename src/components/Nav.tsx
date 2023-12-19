import React, { Children } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";

//BTW IN THE FontAwesomeIcon tag you can add an effect on the icon HOORAHHHHHH!!!
interface User {
  name: string;
}

interface NavProps {
  user: User | null; // Define the type for the user prop
}
export default function Nav({ user }: NavProps) {
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
        {user ? <b>You are {user.name}</b> : null}
      </ul>
    </nav>
  );
}

//TL;DR, click on page then it gets activated, remove "end:true" if you want it to still be active if inside the page.
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
