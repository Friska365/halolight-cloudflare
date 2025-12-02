import { describe, expect, it } from "vitest"

import {
  AUTH_ROUTES,
  findPermissionRule,
  getMenuPermission,
  getRoutePermission,
  getRouteTitle,
  isAuthRoute,
  isPublicRoute,
  MENU_ITEMS,
  PERMISSION_RULES,
  PUBLIC_ROUTES,
  ROUTE_PERMISSIONS,
  ROUTE_TITLES,
} from "@/config/routes"

describe("routes config", () => {
  describe("PUBLIC_ROUTES", () => {
    it("应包含登录和注册路由", () => {
      expect(PUBLIC_ROUTES).toContain("/login")
      expect(PUBLIC_ROUTES).toContain("/register")
    })

    it("应包含密码重置路由", () => {
      expect(PUBLIC_ROUTES).toContain("/forgot-password")
      expect(PUBLIC_ROUTES).toContain("/reset-password")
    })

    it("应包含法律条款路由", () => {
      expect(PUBLIC_ROUTES).toContain("/terms")
      expect(PUBLIC_ROUTES).toContain("/privacy")
    })
  })

  describe("AUTH_ROUTES", () => {
    it("应是 PUBLIC_ROUTES 的子集（排除法律条款）", () => {
      const legalRoutes = ["/terms", "/privacy"]
      const publicRoutesWithoutLegal = PUBLIC_ROUTES.filter(
        (r) => !legalRoutes.includes(r)
      )
      expect(AUTH_ROUTES.length).toBe(publicRoutesWithoutLegal.length)
      AUTH_ROUTES.forEach((route) => {
        expect(PUBLIC_ROUTES).toContain(route)
      })
    })
  })

  describe("ROUTE_PERMISSIONS", () => {
    it("应为首页定义 dashboard:view 权限", () => {
      expect(ROUTE_PERMISSIONS["/"]).toBe("dashboard:view")
    })

    it("应为用户管理定义 users:view 权限", () => {
      expect(ROUTE_PERMISSIONS["/users"]).toBe("users:view")
    })

    it("应为设置页面定义 settings:view 权限", () => {
      expect(ROUTE_PERMISSIONS["/settings"]).toBe("settings:view")
      expect(ROUTE_PERMISSIONS["/settings/teams"]).toBe("settings:view")
    })
  })

  describe("ROUTE_TITLES", () => {
    it("应为首页定义标题", () => {
      expect(ROUTE_TITLES["/"]).toBe("仪表盘")
    })

    it("应为所有主要路由定义标题", () => {
      expect(ROUTE_TITLES["/users"]).toBe("用户管理")
      expect(ROUTE_TITLES["/analytics"]).toBe("数据分析")
      expect(ROUTE_TITLES["/documents"]).toBe("文档管理")
    })
  })

  describe("PERMISSION_RULES", () => {
    it("应包含所有主要路由的权限规则", () => {
      expect(PERMISSION_RULES.length).toBeGreaterThan(0)

      const patterns = PERMISSION_RULES.map((r) => r.pattern.toString())
      expect(patterns).toContain("/^\\/$/")
      expect(patterns).toContain("/^\\/users/")
    })
  })

  describe("MENU_ITEMS", () => {
    it("应包含仪表盘菜单项", () => {
      const dashboard = MENU_ITEMS.find((item) => item.href === "/")
      expect(dashboard).toBeDefined()
      expect(dashboard?.title).toBe("仪表盘")
    })

    it("应包含带子菜单的项目", () => {
      const settingsItem = MENU_ITEMS.find((item) => item.href === "/settings")
      expect(settingsItem).toBeDefined()
      expect(settingsItem?.children).toBeDefined()
      expect(settingsItem?.children?.length).toBeGreaterThan(0)
    })
  })

  describe("isPublicRoute", () => {
    it("应正确识别公开路由", () => {
      expect(isPublicRoute("/login")).toBe(true)
      expect(isPublicRoute("/register")).toBe(true)
      expect(isPublicRoute("/forgot-password")).toBe(true)
    })

    it("应正确识别非公开路由", () => {
      expect(isPublicRoute("/")).toBe(false)
      expect(isPublicRoute("/users")).toBe(false)
      expect(isPublicRoute("/settings")).toBe(false)
    })
  })

  describe("isAuthRoute", () => {
    it("应正确识别认证路由", () => {
      expect(isAuthRoute("/login")).toBe(true)
      expect(isAuthRoute("/register")).toBe(true)
    })

    it("法律条款不应是认证路由", () => {
      expect(isAuthRoute("/terms")).toBe(false)
      expect(isAuthRoute("/privacy")).toBe(false)
    })
  })

  describe("getRoutePermission", () => {
    it("应返回精确匹配的权限", () => {
      expect(getRoutePermission("/")).toBe("dashboard:view")
      expect(getRoutePermission("/users")).toBe("users:view")
    })

    it("应通过正则匹配返回权限", () => {
      expect(getRoutePermission("/users/123")).toBe("users:view")
      expect(getRoutePermission("/settings/teams/roles")).toBe("settings:view")
    })

    it("应为未定义的路由返回 undefined", () => {
      expect(getRoutePermission("/unknown-route")).toBeUndefined()
    })
  })

  describe("getRouteTitle", () => {
    it("应返回精确匹配的标题", () => {
      expect(getRouteTitle("/")).toBe("仪表盘")
      expect(getRouteTitle("/users")).toBe("用户管理")
    })

    it("应通过正则匹配返回标题", () => {
      expect(getRouteTitle("/users/123")).toBe("用户管理")
    })

    it("应为未定义的路由返回默认标题", () => {
      expect(getRouteTitle("/unknown-route")).toBe("HaloLight")
    })
  })

  describe("findPermissionRule", () => {
    it("应找到匹配的权限规则", () => {
      const rule = findPermissionRule("/users")
      expect(rule).toBeDefined()
      expect(rule?.permission).toBe("users:view")
      expect(rule?.label).toBe("用户管理")
    })

    it("应为不匹配的路由返回 undefined", () => {
      const rule = findPermissionRule("/unknown-route")
      expect(rule).toBeUndefined()
    })
  })

  describe("getMenuPermission", () => {
    it("应返回菜单项的权限", () => {
      expect(getMenuPermission("/")).toBe("dashboard:view")
      expect(getMenuPermission("/users")).toBe("users:view")
    })

    it("应为未定义的菜单返回 undefined", () => {
      expect(getMenuPermission("/unknown")).toBeUndefined()
    })
  })
})
