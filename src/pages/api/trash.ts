import type { NextApiRequest, NextApiResponse } from "next";
import {
  fetchLocationsControllerHandle,
  restoreLocationControllerHandle,
  deleteLocationControllerHandle,
} from "../../server/client/locations/locations";
import {
  fetchCategoriesControllerHandle,
  restoreCategoryControllerHandle,
  deleteCategoryControllerHandle,
} from "../../server/client/categories/categories";
import {
  fetchProblemsControllerHandle,
  restoreProblemControllerHandle,
  deleteProblemControllerHandle,
} from "../../server/client/problems/problems";
import { getUserProfileControllerHandle } from "../../server/client/user-profile/user-profile";
import { getRoleLevel } from "../../utils/role-mapping";

function filterByDeletedDate(
  items: Array<{ deletedAt?: string | null }>,
  dateFilter?: string,
) {
  if (!dateFilter || dateFilter === "all") {
    return items;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return items.filter((item) => {
    if (!item.deletedAt) return false;

    const deletedDate = new Date(item.deletedAt);

    switch (dateFilter) {
      case "today": {
        return deletedDate >= today;
      }
      case "last7days": {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return deletedDate >= sevenDaysAgo;
      }
      case "last30days": {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return deletedDate >= thirtyDaysAgo;
      }
      case "thisyear": {
        return deletedDate.getFullYear() === 2025;
      }
      default:
        return true;
    }
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authToken = req.cookies["auth-token"];

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const { query, type, dateFilter } = req.query;

      const searchQuery =
        query && typeof query === "string" ? query : undefined;

      const itemType = type && typeof type === "string" ? type : undefined;

      const dateFilterValue =
        dateFilter && typeof dateFilter === "string" ? dateFilter : undefined;

      let currentUserId: string | null = null;
      let roleLevel = 0;
      try {
        const profile = await getUserProfileControllerHandle({
          headers: { Authorization: `Bearer ${authToken}` },
        });
        currentUserId = profile?.id ?? null;
        roleLevel = profile?.role ? getRoleLevel(profile.role) : 0;
      } catch {
        // continua sem filtrar por usuário em caso de erro no perfil
      }

      const isReporter = roleLevel === 1;
      const onlyOwnProblems = (problems: Array<Record<string, unknown>>) =>
        currentUserId
          ? problems.filter(
              (p) => (p.reporterId as string) === currentUserId,
            )
          : problems;

      const results: {
        items: unknown[];
        total: number;
        type?: string;
      } = { items: [], total: 0 };

      if (!itemType || itemType === "all") {
        const fetchPayload = {
          headers: { Authorization: `Bearer ${authToken}` },
        };

        const [locationsData, categoriesData, problemsData] = await Promise.all([
          isReporter
            ? Promise.resolve({ locations: [] })
            : fetchLocationsControllerHandle(
                { includeDeleted: true, query: searchQuery },
                fetchPayload,
              ),
          isReporter
            ? Promise.resolve({ categories: [] })
            : fetchCategoriesControllerHandle(
                { includeDeleted: true, query: searchQuery },
                fetchPayload,
              ),
          fetchProblemsControllerHandle(
            { includeDeleted: true, query: searchQuery },
            fetchPayload,
          ),
        ]);

        const deletedLocations =
          locationsData?.locations?.filter(
            (loc: { deletedAt?: string | null }) =>
              loc.deletedAt !== null && loc.deletedAt !== undefined,
          ) || [];
        const deletedCategories =
          categoriesData?.categories?.filter(
            (cat: { deletedAt?: string | null }) =>
              cat.deletedAt !== null && cat.deletedAt !== undefined,
          ) || [];
        const deletedProblemsRaw =
          (problemsData?.problems as unknown as Array<Record<string, unknown>>)?.filter(
            (prob) =>
              prob.deletedAt !== null && prob.deletedAt !== undefined,
          ) || [];
        const deletedProblems = onlyOwnProblems(deletedProblemsRaw);

        const filteredLocations = filterByDeletedDate(
          deletedLocations,
          dateFilterValue,
        );
        const filteredCategories = filterByDeletedDate(
          deletedCategories,
          dateFilterValue,
        );
        const filteredProblems = filterByDeletedDate(
          deletedProblems as Array<{ deletedAt?: string | null }>,
          dateFilterValue,
        );

        const allItems = [
          ...filteredLocations.map((item) => ({
            ...(item as Record<string, unknown>),
            itemType: "location",
          })),
          ...filteredCategories.map((item) => ({
            ...(item as Record<string, unknown>),
            itemType: "category",
          })),
          ...filteredProblems.map((item) => {
            const prob = item as Record<string, unknown> & {
              location?: { name?: string };
            };
            return {
              ...prob,
              itemType: "problem",
              name: prob.title,
              local: prob.location?.name ?? prob.locationName,
              description: prob.excerpt || prob.description,
            };
          }),
        ];

        results.items = allItems;
        results.total = allItems.length;
      } else if (itemType === "location") {
        if (isReporter) {
          results.items = [];
          results.total = 0;
          results.type = "location";
        } else {
          const data = await fetchLocationsControllerHandle(
            {
              includeDeleted: true,
              query: searchQuery,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );

          const deletedItems =
            data?.locations?.filter(
              (loc: { deletedAt?: string | null }) =>
                loc.deletedAt !== null && loc.deletedAt !== undefined,
            ) || [];

          const filteredItems = filterByDeletedDate(
            deletedItems,
            dateFilterValue,
          );

          results.items = filteredItems.map((item) => ({
            ...(item as Record<string, unknown>),
            itemType: "location",
          }));
          results.total = filteredItems.length;
          results.type = "location";
        }
      } else if (itemType === "category") {
        if (isReporter) {
          results.items = [];
          results.total = 0;
          results.type = "category";
        } else {
          const data = await fetchCategoriesControllerHandle(
            {
              includeDeleted: true,
              query: searchQuery,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );

          const deletedItems =
            data?.categories?.filter(
              (cat: { deletedAt?: string | null }) =>
                cat.deletedAt !== null && cat.deletedAt !== undefined,
            ) || [];

          const filteredItems = filterByDeletedDate(
            deletedItems,
            dateFilterValue,
          );

          results.items = filteredItems.map((item) => ({
            ...(item as Record<string, unknown>),
            itemType: "category",
          }));
          results.total = filteredItems.length;
          results.type = "category";
        }
      } else if (itemType === "problem") {
        const data = await fetchProblemsControllerHandle(
          {
            includeDeleted: true,
            query: searchQuery,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const deletedItemsRaw =
          (data?.problems as unknown as Array<Record<string, unknown>>)?.filter(
            (prob) =>
              prob.deletedAt !== null && prob.deletedAt !== undefined,
          ) || [];
        const deletedItems = onlyOwnProblems(deletedItemsRaw);

        const filteredItems = filterByDeletedDate(
          deletedItems as Array<{ deletedAt?: string | null }>,
          dateFilterValue,
        );

        results.items = filteredItems.map((item) => {
          const prob = item as Record<string, unknown> & {
            location?: { name?: string };
          };
          return {
            ...prob,
            itemType: "problem",
            name: prob.title,
            local: prob.location?.name ?? prob.locationName,
            description: prob.excerpt || prob.description,
          };
        });
        results.total = filteredItems.length;
        results.type = "problem";
      }

      return res.status(200).json(results);
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as unknown as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = axiosError.response?.status || 500;
        const message =
          axiosError.response?.data?.message || "Internal server error";

        return res.status(status).json({ message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { action, ids, type } = req.body;

      if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Ação e IDs são obrigatórios" });
      }

      if (action === "restore") {
        const promises = ids.map((id: string) => {
          if (type === "location") {
            return restoreLocationControllerHandle(id, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
          } else if (type === "category") {
            return restoreCategoryControllerHandle(id, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
          } else if (type === "problem") {
            return restoreProblemControllerHandle(id, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
          }
          return Promise.resolve();
        });

        await Promise.all(promises);
        return res
          .status(200)
          .json({ message: "Itens restaurados com sucesso" });
      } else if (action === "delete") {
        const promises = ids.map((id: string) => {
          if (type === "location") {
            return deleteLocationControllerHandle(id, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
          } else if (type === "category") {
            return deleteCategoryControllerHandle(id, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
          } else if (type === "problem") {
            return deleteProblemControllerHandle(id, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
          }
          return Promise.resolve();
        });

        await Promise.all(promises);
        return res
          .status(200)
          .json({ message: "Itens excluídos permanentemente" });
      } else {
        return res.status(400).json({ message: "Ação inválida" });
      }
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as unknown as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = axiosError.response?.status || 500;
        const errorData = axiosError.response?.data || {};

        return res.status(status).json(errorData);
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
