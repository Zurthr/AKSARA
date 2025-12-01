<template>
  <div class="index-page">
    <EventsSection />
    <div class="index-page-content">
      <div class="index-page-content-left">
        <ReadsSection />
        <ForumCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
      </div>
      <div>
        <!-- <Sidebars /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auto import not working gatau kenapa jirr
import ReadsSection from '~/components/Literature/ReadsSection.vue';

const posts = [
  {
    id: 1,
    author: {
      name: "Orang Kmplang",
      avatar: "https://i.pravatar.cc/150?u=kmplang",
      tagline: "A stupid one"
    },
    timeAgo: "an hr ago",
    title: "LF Best Books for Aspiring Web Developers",
    content: "Hey everyone! I've been diving deeper into web development lately, and I realized there's a ton of great books out there that can really help you level up beyond just YouTube tutorials. Thought I'd share a few and see what you all recommend too!",
    tags: [
      { label: "A Level", type: "category" },
      { label: "Web Dev", type: "topic" },
      { label: "#NewDev", type: "topic" },
      { label: "#WebDev", type: "topic" },
      { label: "#Stacking", type: "topic" }
    ],
    stars: 80
  },
  {
    id: 2,
    author: {
      name: "Alfan Gunadar",
      avatar: "https://i.pravatar.cc/150?u=alfan",
      tagline: "Something Vanity!"
    },
    timeAgo: "3 hrs ago",
    title: "Is FNAF 2 going to debut in Minecraft alongside Herobrine",
    content: "Okay, so I've been seeing some weird stuff in the latest Minecraft teasers and community rumors — people are saying there might be a crossover event bringing FNAF 2 elements into Minecraft?? Like animatronics, the pizzeria setting, and even a Herobrine tie-in?! Not sure if it's a mod collab, an ARG, or just wild fan theory fuel, but if Mojang actually drops a spooky update mixing Herobrine lore with FNAF 2 jumpscares, that would be insane. Anyone else heard about this or seen the leaks? What do you think — hype or hoax? 👻",
    tags: [
      { label: "Hobbies", type: "category" },
      { label: "FNAF", type: "topic" },
      { label: "#FNAF", type: "topic" },
      { label: "#Booo", type: "topic" },
      { label: "#Horror", type: "topic" }
    ],
    stars: 21
  },
  {
    id: 3,
    author: {
      name: "Alfan Gunadar",
      avatar: "https://i.pravatar.cc/150?u=alfan",
      tagline: "Something Vanity!"
    },
    timeAgo: "3 hrs ago",
    title: "Is FNAF 2 going to debut in Minecraft alongside Herobrine",
    content: "Okay, so I've been seeing some weird stuff in the latest Minecraft teasers and community rumors — people are saying there might be a crossover event bringing FNAF 2 elements into Minecraft?? Like animatronics, the pizzeria setting, and even a Herobrine tie-in?! Not sure if it's a mod collab, an ARG, or just wild fan theory fuel, but if Mojang actually drops a spooky update mixing Herobrine lore with FNAF 2 jumpscares, that would be insane. Anyone else heard about this or seen the leaks? What do you think — hype or hoax? 👻",
    tags: [
      { label: "Hobbies", type: "category" },
      { label: "FNAF", type: "topic" },
      { label: "#FNAF", type: "topic" },
      { label: "#Booo", type: "topic" },
      { label: "#Horror", type: "topic" }
    ],
    stars: 21
  }
];
</script>

<style scoped>
.index-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.index-page-content {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.index-page-content-left {
  display: flex;
  width: 920px;
  flex-direction: column;
  gap: 20px;
}
</style>

