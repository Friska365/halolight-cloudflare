import type { NextPageContext } from "next"
import Link from "next/link"

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: "0 0 1rem 0" }}>
        {statusCode || "Error"}
      </h1>
      <p style={{ fontSize: "1.25rem", color: "#666" }}>
        {statusCode === 404
          ? "页面未找到"
          : statusCode === 500
            ? "服务器错误"
            : "发生了错误"}
      </p>
      <Link
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          background: "#000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "0.5rem",
        }}
      >
        返回首页
      </Link>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
