package com.project.ecoscan_backend.dtos;

public class LeaderboardEntryDTO {

    private int rank;
    private String userId;
    private String fullName;
    private String organization;
    private int ecoPoints;
    private String level;
    private String levelIcon;

    public LeaderboardEntryDTO() {}

    public LeaderboardEntryDTO(int rank, String userId, String fullName,
                               String organization, int ecoPoints,
                               String level, String levelIcon) {
        this.rank = rank;
        this.userId = userId;
        this.fullName = fullName;
        this.organization = organization;
        this.ecoPoints = ecoPoints;
        this.level = level;
        this.levelIcon = levelIcon;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public int getEcoPoints() { return ecoPoints; }
    public void setEcoPoints(int ecoPoints) { this.ecoPoints = ecoPoints; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getLevelIcon() { return levelIcon; }
    public void setLevelIcon(String levelIcon) { this.levelIcon = levelIcon; }
}
