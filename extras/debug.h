#include <bits/stdc++.h>
using namespace std;
/******** Debug Code *******/
void __print(int x) { cerr << x; }
void __print(long x) { cerr << x; }
void __print(long long x) { cerr << x; }
void __print(unsigned x) { cerr << x; }
void __print(unsigned long x) { cerr << x; }
void __print(unsigned long long x) { cerr << x; }
void __print(float x) { cerr << x; }
void __print(double x) { cerr << x; }
void __print(long double x) { cerr << x; }
void __print(char x) { cerr << '\'' << x << '\''; }
void __print(const char *x) { cerr << '\"' << x << '\"'; }
void __print(const string &x) { cerr << '\"' << x << '\"'; }
void __print(bool x) { cerr << (x ? "true" : "false"); }
template <typename A>
void __print(const A &x);
template <typename A, typename B>
void __print(const pair<A, B> &p);
template <typename... A>
void __print(const tuple<A...> &t);
template <typename T>
void __print(stack<T> s);
template <typename T>
void __print(queue<T> q);
template <typename T, typename... U>
void __print(priority_queue<T, U...> q);
template <typename A>
void __print(const A &x) {
    bool first = true;
    cerr << '{';
    for (const auto &i : x) {
        cerr << (first ? "" : ","), __print(i);
        first = false;
    }
    cerr << '}';
}
template <typename A, typename B>
void __print(const pair<A, B> &p) {
    cerr << '(';
    __print(p.first);
    cerr << ',';
    __print(p.second);
    cerr << ')';
}
template <typename... A>
void __print(const tuple<A...> &t) {
    bool first = true;
    cerr << '(';
    apply([&first](const auto &...args) { ((cerr << (first ? "" : ","), __print(args), first = false), ...); }, t);
    cerr << ')';
}
template <typename T>
void __print(stack<T> s) {
    vector<T> debugVector;
    while (!s.empty()) {
        T t = s.top();
        debugVector.push_back(t);
        s.pop();
    }
    reverse(debugVector.begin(), debugVector.end());
    __print(debugVector);
}
template <typename T>
void __print(queue<T> q) {
    vector<T> debugVector;
    while (!q.empty()) {
        T t = q.front();
        debugVector.push_back(t);
        q.pop();
    }
    __print(debugVector);
}
template <typename T, typename... U>
void __print(priority_queue<T, U...> q) {
    vector<T> debugVector;
    while (!q.empty()) {
        T t = q.top();
        debugVector.push_back(t);
        q.pop();
    }
    __print(debugVector);
}
void _print() { cerr << "]\n"; }
template <typename Head, typename... Tail>
void _print(const Head &H, const Tail &...T) {
    __print(H);
    if (sizeof...(T))
        cerr << ", ";
    _print(T...);
}


std::string getIndentation(int level, int spacesPerIndent)
{
    return std::string(level * spacesPerIndent, ' ');
}

template <typename T>
void printt(const T &data)
{
    std::cout << data;
}

template <typename T>
void print(const std::vector<T> &vec)
{
    for (const auto &element : vec)
    {
        printt(element);
        std::cout << " ";
    }cout<<'\n';
}

template <typename K, typename V>
void print(const std::map<K, V> &map)
{
    for (const auto &element : map)
    {
        const auto &key = element.first;
        const auto &value = element.second;
        std::cout << key << " ";
        printt(value);
        std::cout << "\n";
    }
}

template <typename T>
void print(const std::set<T> &set)
{
    for (const auto &element : set)
    {
        printt(element);
        std::cout << " ";
    }
}

template <typename Arg>
void printArgs(Arg &&arg)
{
    printt(std::forward<Arg>(arg));
}

template <typename Arg, typename... Args>
void printArgs(Arg &&arg, Args &&...args)
{
    printt(std::forward<Arg>(arg));
    std::cout << ", ";
    printArgs(std::forward<Args>(args)...);
}


template <typename Func, typename... Args>
auto printFunctionResult(Func function, Args &&...args) -> decltype(function(std::forward<Args>(args)...))
{
    static int depth = 0;
    std::string indent = getIndentation(depth, 2);
    std::cout << '\n'
              << indent << "F"
              << "(";
    printArgs(std::forward<Args>(args)...);
    std::cout << ") = ";
    depth++;
    auto result = function(std::forward<Args>(args)...);
    depth--;
    std::cout << '\n'
              << indent << "F"
              << "(";
    printArgs(std::forward<Args>(args)...);
    std::cout << ") = ";
    print(result);
    return result;
}
#ifndef ONLINE_JUDGE
#define db(...) cerr << "Line:" << __LINE__ << " [" << #__VA_ARGS__ << "] = ["; _print(__VA_ARGS__)
#else
#define db(...)
#endif